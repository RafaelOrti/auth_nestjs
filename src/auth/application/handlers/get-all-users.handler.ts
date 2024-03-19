import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllUsersQuery } from '../queries/get-all-users.query';
import { UserRepository } from '../../infrastructure/persistence/userRepository';
import { User } from '../../domain/entities/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common'; 

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  private readonly logger = new Logger(GetAllUsersHandler.name); 

  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetAllUsersQuery): Promise<User[]> {
    this.logger.log('Fetching all users'); 

    try {
      const users = await this.userRepository.findAll();
      this.logger.log(`Successfully fetched ${users.length} users`); 
      return users;
    } catch (error) {
      this.logger.error('Failed to fetch users', error.stack); 
      throw new InternalServerErrorException('Failed to fetch users'); 
    }
  }
}
