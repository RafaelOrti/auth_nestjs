import { Controller, Post, Get, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

import { RegisterCommand } from '../../application/commands/register.command';
import { LoginCommand } from '../../application/commands/login.command';
import { UpdateUserCommand } from '../../application/commands/update-user.command';
import { DeleteUserCommand } from '../../application/commands/delete-user.command';
import { CheckEmailExistsQuery } from '../../application/queries/check-email-exists.query';
import { GetAllUsersQuery } from '../../application/queries/get-all-users.query';
import { UserDto } from '../../application/dto/user-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async register(@Body() userDto: UserDto) {
    return this.commandBus.execute(new RegisterCommand(userDto.email, userDto.password));
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() userDto: UserDto) {
    return this.commandBus.execute(new LoginCommand(userDto.email, userDto.password));
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'User list retrieved successfully.' })
  @ApiBearerAuth()
  async findAllUsers() {
    return this.queryBus.execute(new GetAllUsersQuery());
  }

  @Get('check-email-exists/:email')
  @ApiOperation({ summary: 'Check if an email exists' })
  @ApiParam({ name: 'email', required: true })
  @ApiResponse({ status: 200, description: 'Email existence checked successfully.' })
  async checkEmailExists(@Param('email') email: string) {
    return this.queryBus.execute(new CheckEmailExistsQuery(email));
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto) {
    const command = new UpdateUserCommand(id, userDto.email, userDto.password);
    const result = await this.commandBus.execute(command);
    return { message: 'User updated successfully', user: result };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing user' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.commandBus.execute(new DeleteUserCommand(id));
    return { message: 'User deleted successfully' };
  }
}
