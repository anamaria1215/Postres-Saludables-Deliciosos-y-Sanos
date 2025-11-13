import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './Dtos/createUser.dto';
import { UpdateUserDto } from './Dtos/updateUser.dto';
import { LoginUserDto } from './Dtos/loginUser.dto';
import { User } from '../entities/user.entity';
import { UpdatePasswordDto } from './Dtos/updatePassword.dto';
import { DeactivateUserDto } from './Dtos/desactivateUser.dto';
import { ChangeRoleDto } from './Dtos/changeRole.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(data);
  }

  async loginUser(data: LoginUserDto) {
    return await this.userRepository.loginUser(data.username, data.password);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUserRepository();
  }

  async updatePassword(uuid: string, data: UpdatePasswordDto) {
  return await this.userRepository.updatePassword(uuid, data);
}

  async getUserById(uuid: string): Promise<User> {
    return await this.userRepository.getUserByIdRepository(uuid);
  }

  async updateUser(uuid: string, data: UpdateUserDto): Promise<User> {
    if (!uuid) throw new BadRequestException('UUID es obligatorio');
    return await this.userRepository.putUpdateUserRepository(uuid, data);
  }

  async deleteUser(uuid: string): Promise<{ message: string }> {
    if (!uuid) throw new BadRequestException('UUID es obligatorio');
    return await this.userRepository.deleteUser(uuid);
  }

  async deactivateUser(uuid: string, data: DeactivateUserDto) {
  return await this.userRepository.deactivateUser(uuid, data);
  }

  async changeUserRole(uuid: string, data: ChangeRoleDto) {
  return await this.userRepository.changeUserRole(uuid, data);
  }


}