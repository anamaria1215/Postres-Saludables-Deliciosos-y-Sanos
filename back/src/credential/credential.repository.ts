import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credential } from '../entities/credential.entity';
import { ChangeUsernameDto } from './DTOs/change-username.dto';
import { CartStatus } from 'src/enum/cart-status.enum';
import { ChangeRoleDto } from './DTOs/change-role.dto';

@Injectable()
export class CredentialRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
  ) {}

  //Métodos para atenticación

  //Registro --> El servicio está en el AuthService
  async getCredentialByUsernameRepository(username: string) {
    console.log('Se envío la respuesta del getCredentialByUsername.');
    return await this.credentialRepository.findOne({ 
      where: { username : username},
      relations: ['user'],
    });
  }

  async postCreateCredentialRepository(
    newCredential: Partial<Credential>
  ): Promise<Credential>{
    const savedCredential = this.credentialRepository.create(newCredential);
    return await this.credentialRepository.save(savedCredential);
  }

  //Rutas del admin

  //Obtener todas las credenciales (activas e inactivas)
  async getAllCredentialsRepository() {
    console.log('Se envío la respuesta del getAllCredentials.');
    return await this.credentialRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  //Obetener una credencial por Id
  async getCredentialByIdRepository(uuid: string) {
    console.log('Se envío la respuesta del getCredentialById.');
    return await this.credentialRepository.findOne({
      where: { uuid: uuid },
      relations: ['user'],
    });
  }

  //Rutas compartidas

  //Actualizar username
  async putChangeUsernameRepository(
    credentialExists: Credential,
    changeUsernameDto: ChangeUsernameDto,
  ) {
    if (changeUsernameDto.username) {
      credentialExists.username = changeUsernameDto.username;
    }
    await this.credentialRepository.save(credentialExists);
    console.log(`Credenciales del usuario ${credentialExists.username} actualizadas correctamente.`);
    return { 
      message: `Credenciales del usuario ${credentialExists.username} actualizadas correctamente.`,
    }; 
  }

  //Cambiar la contraseña (solo el dueño de la cuenta)
  async patchChangePasswordRepository(
    credentialExists: Credential,
    hashedPassword: string,
  ) {
    credentialExists.password = hashedPassword;
    await this.credentialRepository.save(credentialExists);
    console.log('Contraseña modificada correctamente.');
    return {
      message: 'Contraseña modificada correctamente.',
    };
  }

  //Desactivar credencial (soft delete)
  async desactivateCredAndUserProfRepository(credentialExists: Credential) {
    //Desactivar credencial
    credentialExists.isActive = false;
    await this.credentialRepository.save(credentialExists);
    console.log(`Credenciales del usuario ${credentialExists.username} desactivadas.`);
    //Desactivar el perfil asociado
    if (credentialExists.user) {
      credentialExists.user.isActive = false;
      await this.credentialRepository.manager.save(credentialExists.user);
      console.log(`Perfil asociado al usuario "${credentialExists.username}" también fue desactivado.`);
      // Desactivar carrito activo asociado al perfil
      if (credentialExists.user.carts && credentialExists.user.carts.length > 0) {
        // Buscar el carrito ACTIVO
        const activeCart = credentialExists.user.carts.find(
          (cart) => cart.status === CartStatus.ACTIVO
        );

        if (activeCart) {
          activeCart.status = CartStatus.INACTIVO;
          await this.credentialRepository.manager.save(activeCart);
          console.log(
            `Carrito activo del usuario "${credentialExists.username}" desactivado.`
          );
        } else {
          console.warn(
            `El usuario "${credentialExists.username}" no tiene un carrito activo.`
          );
        }
      } else {
        console.warn(
          `El perfil usuario "${credentialExists.username}" no tiene carritos asociados.`
        );
      }
      console.log(`Credenciales del usuario ${credentialExists.username}, perfil y carrito asociados desactivados correctamente.`)
      return {
        message: `Credenciales del usuario ${credentialExists.username}, perfil y carrito asociados desactivados correctamente.`
      };
    }
  }

  //Re-activar una cuenta (y el perfil asociado)
  async activateCredAndUserProfRepository(credentialExists: Credential) {
    //Activar credencial
    credentialExists.isActive = true;
    await this.credentialRepository.save(credentialExists);
    console.log(`Credenciales del usuario ${credentialExists.username} activadas.`);
    //Activar el perfil asociado
    if (credentialExists.user) {
      credentialExists.user.isActive = true;
      await this.credentialRepository.manager.save(credentialExists.user);
      console.log(`Perfil asociado al usuario "${credentialExists.username}" también fue activado.`);
      //Activar carrito activo asociado al perfil
      if (credentialExists.user.carts && credentialExists.user.carts.length > 0) {
        // Buscar el carrito INACTIVO
        const inactiveCart = credentialExists.user.carts.find(
          (cart) => cart.status === CartStatus.INACTIVO
        );

        if (inactiveCart) {
          inactiveCart.status = CartStatus.ACTIVO;
          await this.credentialRepository.manager.save(inactiveCart);
          console.log(
            `Carrito inactivo del usuario "${credentialExists.username}" activado.`
          );
        } else {
          console.warn(
            `El usuario "${credentialExists.username}" no tiene un carrito inactivo.`
          );
        }

      } else {
        console.warn(
          `El perfil del usuario "${credentialExists.username}" no tiene carritos asociados.`
        );
      }

      console.log(`Credenciales del usuario ${credentialExists.username}, perfil y carrito asociados activados correctamente.`)
      return {
        message: `Credenciales del usuario ${credentialExists.username}, perfil y carrito asociados activados correctamente.`
      };
    }
  } 

  //Cambiar rol
  async putChangeUserRoleRepository(
    credentialExists: Credential,
    changeRoleDto: ChangeRoleDto
  ) {
    credentialExists.role = changeRoleDto.role;
    await this.credentialRepository.save(credentialExists);
    return { 
      message: `Rol del usuario "${credentialExists.username}" actualizado a "${changeRoleDto.role}" correctamente.` 
    };
  }
}
