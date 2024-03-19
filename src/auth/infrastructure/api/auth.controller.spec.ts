import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterCommand } from '../../application/commands/register.command';
import { LoginCommand } from '../../application/commands/login.command';
import { UpdateUserCommand } from '../../application/commands/update-user.command';
import { DeleteUserCommand } from '../../application/commands/delete-user.command';
import { UserDto } from '../../application/dto/user-dto';
import { CheckEmailExistsQuery } from '../../application/queries/check-email-exists.query';
import { GetAllUsersQuery } from '../../application/queries/get-all-users.query';

describe('AuthController', () => {
  let authController: AuthController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [CommandBus, QueryBus],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('register', () => {
    it('should call commandBus with RegisterCommand', async () => {
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await authController.register(userDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new RegisterCommand(userDto.email, userDto.password),
      );
    });
  });

  describe('login', () => {
    it('should call commandBus with LoginCommand', async () => {
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await authController.login(userDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new LoginCommand(userDto.email, userDto.password),
      );
    });
  });

  describe('findAllUsers', () => {
    it('should call queryBus with GetAllUsersQuery', async () => {
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce([]);

      await authController.findAllUsers();

      expect(queryBus.execute).toHaveBeenCalledWith(new GetAllUsersQuery());
    });
  });

  describe('checkEmailExists', () => {
    it('should call queryBus with CheckEmailExistsQuery', async () => {
      const email = 'test@example.com';
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(true);

      const result = await authController.checkEmailExists(email);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new CheckEmailExistsQuery(email),
      );
      expect(result).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('should call commandBus with UpdateUserCommand', async () => {
      const id = 1;
      const userDto: UserDto = {
        email: 'update@example.com',
        password: 'newpassword123',
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await authController.updateUser(id, userDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateUserCommand(id, userDto.email, userDto.password),
      );
    });
  });

  describe('deleteUser', () => {
    it('should call commandBus with DeleteUserCommand', async () => {
      const id = 1;
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await authController.deleteUser(id);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeleteUserCommand(id),
      );
    });
  });
});
