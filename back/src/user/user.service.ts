import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './Dtos/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  //Método para buscar un perfil por el nombre
  async getUserByNameService (name: string) {
    //Validar si existe
    const userExists = await this.userRepository.getUserByNameRepository(name);
    if (!userExists || userExists.length === 0) {
      throw new NotFoundException('No existe ningún usuario con ese nombre.');
    }
    return userExists;
  }

  //Método para buscar un perfil por el nombre y el apellido
  async getUserByNameAndLastNameService(name: string, lastName: string) {
    //Validar si existe
    const userExists = await this.userRepository.getUserByNameAndLastNameRepository(name, lastName);
    if (!userExists || userExists.length === 0) {
      throw new NotFoundException('No existe ningún usuario con ese nombre y apellido.');
    }
    return userExists;
  }

  //Rutas del admin

  //Obtener todos los usuarios
  async getAllUsersService() {
    return await this.userRepository.getAllUsersRepository();
  }

  //Consultar el detalle de un perfil por Id
  async getUserByIdService(uuid: string) {
    //Validar si existe
    const userExists = await this.userRepository.getUserByIdRepository(uuid);
    if (!userExists) {
      throw new NotFoundException('Este usuario no existe');
    }
    return userExists;
  }

  //Rutas compartidas

  //Ver el perfil de usuario propio
  async getUserProfileService(req: any) {
    const userId = req.user.user_uuid; //Viene del JWT

    //Validar si existe
    const userExists = await this.userRepository.getUserByIdRepository(userId);
    if (!userExists) {
      throw new NotFoundException('Este usuario no existe');
    }
    //Validar si esta desactivado
    if (userExists.isActive === false) {
      throw new ConflictException('Este perfil se encuentra desactivado.');
    }
    return userExists;
  }

  //Actualizar datos personales básicos
  async putUpdateUserProfileService(req: any, updateUserDto: UpdateUserDto) {
    const userId = req.user.user_uuid; // viene del token JWT
    //Buscar el perfil
    const userExists = await this.userRepository.getUserByIdRepository(userId);
    if (!userExists) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    if (userExists.isActive === false) {
      throw new ConflictException('Este usuario se encuentra desactivado.');
    }
    if (updateUserDto.email) {
      const emailExists = await this.userRepository.getUserByEmailRepository(
        updateUserDto.email
      );
      //Validar si el correo existe si se intenta cambiar
      if (emailExists && emailExists.uuid !== userId) {
        throw new ConflictException('Ya existe un usuario registrado con este correo.')
      }
    }
    return this.userRepository.putUpdateUserProfileRepository(userExists, updateUserDto);
  }
}


