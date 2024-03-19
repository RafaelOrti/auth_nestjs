import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { User } from './domain/entities/user.entity';
import { AuthController } from './infrastructure/api/auth.controller';
import { UserRepository } from './infrastructure/persistence/userRepository';
import { LoginHandler } from './application/handlers/login.handler';
import { RegisterHandler } from './application/handlers/register.handler';
import { GetAllUsersHandler } from './application/handlers/get-all-users.handler'; 
import { UpdateUserHandler } from './application/handlers/update-user.handler'; 
import { DeleteUserHandler } from './application/handlers/delete-user.handler'; 
import { CheckEmailExistsHandler } from './application/handlers/check-email-exists.handler'; 
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/services/authentication.service'; 
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './application/strategies/jwt.strategy'; 
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQPublisherService } from './infrastructure/messaging/rabbitmq-publisher.service'; 
import { jwtConstants } from './infrastructure/config/jwt.config';
import { rabbitMQConfig } from './infrastructure/config/rabbitmq.config';
import { RabbitMQSetupService } from './infrastructure/messaging/rabbit-mq-setup.service'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtConstants),
    RabbitMQModule.forRoot(RabbitMQModule, rabbitMQConfig),
  ],
  controllers: [AuthController],
  providers: [
    LoginHandler,
    RegisterHandler,
    UpdateUserHandler,
    GetAllUsersHandler,
    DeleteUserHandler,
    CheckEmailExistsHandler,
    UserRepository,
    AuthService,
    JwtStrategy,
    RabbitMQPublisherService,
    RabbitMQSetupService,
  ],
})
export class AuthModule {}
