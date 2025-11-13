import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './Dtos/createUser.dto';
import { UpdateUserDto } from './Dtos/updateUser.dto';
import { LoginUserDto } from './Dtos/loginUser.dto';
import { User } from '../entities/user.entity';
import { UpdatePasswordDto } from './Dtos/updatePassword.dto';
import { DeactivateUserDto } from './Dtos/desactivateUser.dto';
import { ChangeRoleDto } from './Dtos/changeRole.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ POST crear usuario
  @Post('createUser')
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return await this.userService.createUser(data);
  }

  // ✅ POST login
  @Post('login')
  async loginUser(@Body() data: LoginUserDto) {
    return await this.userService.loginUser(data);
  }

  // ✅ GET todos
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  // ✅ GET por id
  @Get(':uuid')
  async getUserById(@Param('uuid') uuid: string): Promise<User> {
    return await this.userService.getUserById(uuid);
  }

  // ✅ PUT actualizar
  @Put(':uuid')
  async updateUser(@Param('uuid') uuid: string, @Body() data: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(uuid, data);
  }

  @Put(':uuid/update-password')
  async updatePassword(@Param('uuid') uuid: string, @Body() data: UpdatePasswordDto) {
  return await this.userService.updatePassword(uuid, data);
}
  

  // ✅ DELETE eliminar
  @Delete(':uuid')
  async deleteUser(@Param('uuid') uuid: string): Promise<{ message: string }> {
    return await this.userService.deleteUser(uuid);
  }

  @Put(':uuid/deactivate')
 async deactivateUser(@Param('uuid') uuid: string, @Body() data: DeactivateUserDto) {
  return await this.userService.deactivateUser(uuid, data);
  }

  @Put(':uuid/change-role')
  async changeUserRole(@Param('uuid') uuid: string, @Body() data: ChangeRoleDto) {
   return await this.userService.changeUserRole(uuid, data);
  }

}
