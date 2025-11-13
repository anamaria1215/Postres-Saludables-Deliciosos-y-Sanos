import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Credential } from '../entities/credential.entity';
import { CreateUserDto } from './Dtos/createUser.dto';
import { UpdateUserDto } from './Dtos/updateUser.dto';
import { LoginUserDto } from './Dtos/loginUser.dto';
import { RolesEnum } from 'src/enum/roles.enum';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './Dtos/updatePassword.dto';
import { DeactivateUserDto } from './Dtos/desactivateUser.dto';
import { ChangeRoleDto } from './Dtos/changeRole.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userBD: Repository<User>,

    @InjectRepository(Credential)
    private readonly credentialBD: Repository<Credential>,
  ) {}

  // ✅ Crear usuario
  async createUser(data: CreateUserDto): Promise<User> {
    try {
      // Validar duplicados
      const existingUser = await this.credentialBD.findOne({
        where: { username: data.username },
      });
      if (existingUser) {
        throw new BadRequestException('El nombre de usuario ya está en uso.');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newCredential = this.credentialBD.create({
        username: data.username,
        password: hashedPassword,
        role: RolesEnum.ADMIN,
      });

      const savedCredential = await this.credentialBD.save(newCredential);

      const newUser = this.userBD.create({
        name: data.name,
        lastName: data.lastName,
        address: data.address,
        email: data.email,
        phoneNumber: data.phoneNumber,
        birthDay: data.birthDay,
        credential: savedCredential,
      });

      return await this.userBD.save(newUser);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(`Error al crear el usuario: ${error.message}`);
    }
  }

  // ✅ Login
  async loginUser(username: string, password: string) {
    const credential = await this.credentialBD.findOne({ where: { username } });
    if (!credential) throw new NotFoundException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, credential.password);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    const user = await this.userBD.findOne({
      where: { credential: { uuid: credential.uuid } },
      relations: ['credential'],
    });
    if (!user) throw new NotFoundException('No se encontró el usuario asociado');

    return {
      message: 'Inicio de sesión exitoso',
      user,
    };
  }

  // ✅ Obtener todos
  async getAllUserRepository(): Promise<User[]> {
    try {
      return await this.userBD.find({ relations: ['credential'] });
    } catch {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  // ✅ Obtener por ID
  async getUserByIdRepository(uuid: string): Promise<User> {
    const user = await this.userBD.findOne({
      where: { uuid },
      relations: ['credential', 'order'],
    });
    if (!user) throw new NotFoundException(`Usuario con UUID ${uuid} no encontrado`);
    return user;
  }

  // ✅ Actualizar
  async putUpdateUserRepository(uuid: string, data: UpdateUserDto): Promise<User> {
    const user = await this.userBD.findOne({ where: { uuid } });
    if (!user) throw new NotFoundException(`No se encontró el usuario con UUID ${uuid}`);

    try {
      await this.userBD.update(uuid, data);
      return await this.getUserByIdRepository(uuid);
    } catch {
      throw new BadRequestException('Error al actualizar el usuario');
    }
  }

  // ✅ Actualizar contraseña
  async updatePassword(uuid: string, data: UpdatePasswordDto) {
    const user = await this.userBD.findOne({ where: { uuid }, relations: ['credential'] });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(data.oldPassword, user.credential.password);
    if (!isMatch) throw new UnauthorizedException('La contraseña actual no es correcta');

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    user.credential.password = hashedPassword;
    await this.credentialBD.save(user.credential);

    return { message: 'Contraseña actualizada correctamente' };
  }

  // ✅ Eliminar
  async deleteUser(uuid: string): Promise<{ message: string }> {
    const user = await this.userBD.findOne({ where: { uuid } });
    if (!user) throw new NotFoundException(`Usuario con UUID ${uuid} no encontrado`);

    try {
      await this.userBD.remove(user);
      return { message: 'Usuario eliminado correctamente' };
    } catch {
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }

  // ✅ Activar / Desactivar
  async deactivateUser(uuid: string, data: DeactivateUserDto) {
    const user = await this.userBD.findOne({ where: { uuid }, relations: ['credential'] });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.credential.active = data.active;
    await this.credentialBD.save(user.credential);

    const status = data.active ? 'activado' : 'desactivado';
    return { message: `Usuario ${status} correctamente` };
  }

  // ✅ Cambiar rol
  async changeUserRole(uuid: string, data: ChangeRoleDto) {
    const user = await this.userBD.findOne({ where: { uuid }, relations: ['credential'] });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.credential.role = data.role;
    await this.credentialBD.save(user.credential);

    return { message: `Rol del usuario actualizado a "${data.role}" correctamente` };
  }
}