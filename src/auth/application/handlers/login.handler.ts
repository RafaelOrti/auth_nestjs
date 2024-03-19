import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { AuthService } from '../services/authentication.service';
import { Logger, UnauthorizedException } from '@nestjs/common';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginHandler.name);

  constructor(private readonly authService: AuthService) {}

  async execute(
    command: LoginCommand,
  ): Promise<{ user: any; access_token: string }> {
    const { email, password } = command;
    this.logger.log(`Attempting login for email: ${email}`);

    try {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        this.logger.warn(`Invalid login attempt for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      const token = await this.authService.login(user);

      this.logger.log(`User logged in successfully: ${email}`);
      return {
        user: { id: user.id, email: user.email },
        access_token: token.access_token,
      };
    } catch (error) {
      this.logger.error(
        `Login process failed for email: ${email}`,
        error.stack,
      );
      throw new UnauthorizedException(
        'Login process failed due to an unexpected error',
      );
    }
  }
}
