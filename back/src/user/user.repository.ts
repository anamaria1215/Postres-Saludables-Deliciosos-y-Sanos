import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './Dtos/updateUser.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //Método para buscar user por email (filtro)
  async getUserByEmailRepository(email: string) {
    console.log('Se envío la respuesta del getCredentialByEmail.');
    return await this.userRepository.findOne({
      where: { email : email},
      relations: ['credential'],
    });
  }

  //Método para buscar un perfil por el nombre
  async getUserByNameRepository(name: string) {
    console.log('Se envío la respuesta del getUserByName');
    return await this.userRepository.find({
      where: { name : name },
      relations: ['credential'],
    });
  }

  //Método para buscar un perfil por el nombre y el apellido
  async getUserByNameAndLastNameRepository(name: string, lastName: string) {
    console.log('Se envío la respuesta del getUserByNameAndLastName');
    return await this.userRepository.find({
      where: { 
        name : name,
        lastName : lastName
      },
      relations: ['credential'],
    });
  }

  //Métodos para atenticación

  //Registro --> El servicio está en el AuthService
  async postCreateUserRepository(newUser: Partial<User>): Promise<User> {
    const savedProfile = this.userRepository.create(newUser);
    return await this.userRepository.save(savedProfile);
  }

  //Rutas del admin

  //Obtener todos los usuarios
  async getAllUsersRepository() {
    console.log('Se envió la respuesta del getAllUsers.');
    return await this.userRepository.find({
      order: { name: 'ASC' },
      relations: ['credential']
    });
  }

  //Consultar el detalle de un perfil por Id
  async getUserByIdRepository(uuid: string) {
    console.log('Se envió la respuesta del getUserById.');
    return await this.userRepository.findOne({
      where: { uuid : uuid },
      relations: ['credential']
    });
  }

  //Rutas compartidas

  //Ver el perfil de usuario propio
  async getUserProfileRepository(uuid: string) {
    console.log('Se envió la respuesta del getUserProfile.');
    return await this.userRepository.findOne({
      where: { uuid: uuid },
      relations: ['credential'],
    });
  }
  
  //Actualizar datos personales básicos
  async putUpdateUserProfileRepository(
    userExists: User, 
    updateUserDto: UpdateUserDto
  ) {
    
    if (updateUserDto.name) {
      userExists.name = updateUserDto.name;
    }
    if (updateUserDto.lastName) {
      userExists.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.email) {
      userExists.email = updateUserDto.email;
    }
    if (updateUserDto.phoneNumber) {
      userExists.phoneNumber = updateUserDto.phoneNumber;
    }
    if (updateUserDto.address) {
      userExists.address = updateUserDto.address;
    }
    await this.userRepository.save(userExists);
    console.log(`Perfil del usuario ${userExists.credential.username} actualizado correctamente.`);
    return { 
      message: `Perfil del usuario ${userExists.credential.username} actualizado correctamente.`,
    }; 
  }
}
