import { AuthService } from '../services/authentication.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UserRepository } from '../../infrastructure/persistence/userRepository';
import * as bcrypt from 'bcrypt';
import {
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  private readonly logger = new Logger(UpdateUserHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: UpdateUserCommand): Promise<any> {
    this.logger.log(`Attempting to update user with ID: ${command.id}`);

    const userToUpdate = await this.userRepository.findById(command.id);
    if (!userToUpdate) {
      this.logger.error(`User with ID ${command.id} not found.`);
      throw new NotFoundException(`User with ID ${command.id} not found.`);
    }

    try {
      if (command.email) {
        userToUpdate.email = command.email;
      }

      if (command.password) {
        userToUpdate.password = await bcrypt.hash(command.password, 10);
      }

      await this.userRepository.update(userToUpdate);
      this.logger.log(`User with ID: ${command.id} updated successfully.`);
      return userToUpdate;
    } catch (error) {
      this.logger.error(
        `Failed to update user with ID: ${command.id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to update user with ID: ${command.id}.`,
      );
    }
  }
}
