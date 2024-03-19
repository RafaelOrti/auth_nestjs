import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { RegisterCommand } from '../commands/register.command';
import { UserRepository } from '../../infrastructure/persistence/userRepository';
import { RabbitMQPublisherService } from '../../infrastructure/messaging/rabbitmq-publisher.service';
import * as bcrypt from 'bcrypt';
import {
  Logger,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  private readonly logger = new Logger(RegisterHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly rabbitMQPublisherService: RabbitMQPublisherService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RegisterCommand): Promise<any> {
    const { email, password } = command;
    this.logger.log(`Attempting to register user with email: ${email}`);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      this.logger.warn(
        `Registration attempt failed: Email ${email} is already registered`,
      );
      throw new ConflictException(`Email ${email} is already registered`);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userRepository.create({
        email,
        password: hashedPassword,
      });

      await this.rabbitMQPublisherService.publishUserCreated(newUser.email);
      this.logger.log(`User registered successfully: ${email}`);
      return newUser;
    } catch (error) {
      this.logger.error(`Failed to register user ${email}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to register user due to an unexpected error',
      );
    }
  }
}
