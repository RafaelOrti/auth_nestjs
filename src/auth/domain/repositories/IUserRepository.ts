import { User } from '../entities/user.entity';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User | undefined>;
  delete(id: number): Promise<boolean>;
}
