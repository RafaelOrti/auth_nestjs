import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@Injectable()
export class UserRepository implements IUserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async create(userData: { email: string; password: string }): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      email: userData.email,
      password: userData.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(userUpdate: {
    id: number;
    email?: string;
    password?: string;
  }): Promise<User | undefined> {
    const index = this.users.findIndex((u) => u.id === userUpdate.id);
    if (index !== -1) {
      if (userUpdate.email) {
        this.users[index].email = userUpdate.email;
      }
      if (userUpdate.password) {
        this.users[index].password = userUpdate.password;
      }
      this.users[index].updatedAt = new Date();
      return this.users[index];
    }
    return undefined;
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length !== initialLength;
  }
}
