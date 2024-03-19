import { User } from '../../domain/entities/user.entity';

export class GetAllUsersQuery {
  constructor(public readonly users: User[] = []) {}
}
