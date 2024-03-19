import {
  Injectable,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../infrastructure/persistence/userRepository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        this.logger.log(`User validated: ${email}`);
        return result;
      } else {
        this.logger.warn(`Invalid login attempt: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      this.logger.error(`Error validating user: ${email}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while validating the user.',
      );
    }
  }

  async login(user: any) {
    try {
      const payload = { email: user.email, sub: user.id };
      this.logger.log(`User login: ${user.email}`);
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error(`Login failed for user: ${user.email}`, error.stack);
      throw new UnauthorizedException('Login failed');
    }
  }
}
