import { 
  BadRequestException, 
  ConflictException, 
  Injectable, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { CredentialRepository } from './credential.repository';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './DTOs/change-password.dto';
import { ChangeUsernameDto } from './DTOs/change-username.dto';
import { ChangeRoleDto } from './DTOs/change-role.dto';

@Injectable()
export class CredentialService {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  //Método para buscar una credencial por username (filtro)
  async getCredentialByUsernameService(username: string) {
    //Validar si el usuario existe
    const credentialExists = 
    await this.credentialRepository.getCredentialByUsernameRepository(username);
    if (!credentialExists) {
      throw new NotFoundException('No existe ningún usuario con este nombre de usuario.');
    }
    return credentialExists;
  }

  //Rutas del admin

  //Obtener todas las credenciales (activas e inactivas)
  async getAllCredentialsService() {
    return await this.credentialRepository.getAllCredentialsRepository();
  }

  //Obetener una credencial por Id
  async getCredentialByIdService(uuid: string) {
    //Validar si la credencial existe
    const credentialExists = await this.credentialRepository.getCredentialByIdRepository(uuid);
    if (!credentialExists) {
      throw new NotFoundException('Esta credencial no existe.')
    }
    return credentialExists;
  }

  //Rutas compartidas

  //Actualizar username
  async putChangeUsernameService(
    uuid: string,
    changeUsernameDto: ChangeUsernameDto,
    userLogged: any, //Viene de la request, si user o admin
  ) {
  //Verificar si la credencial existe
  const credentialExists = await this.credentialRepository.getCredentialByIdRepository(uuid);
  if (!credentialExists) {
    throw new NotFoundException('Esta credencial no existe.');
  }
  //Validar si la credencial está desactivada.
  if (credentialExists.isActive === false) {
    throw new ConflictException('Esta credencial se encuentra desactivada.');
  }
  //Asegurar que el usuario sea el dueño
  if (userLogged.credential_uuid !== uuid) {
    throw new UnauthorizedException('No tienes permisos para cambiar el username.');
  }
  //Validar que el nombre de usuario a actualizar no exista
  if (changeUsernameDto.username) {
    const usernameExists = await this.credentialRepository.getCredentialByUsernameRepository(
      changeUsernameDto.username,
    );
    if (usernameExists) {
      throw new ConflictException(
        'Este nombre de usuario ya se encuentra en uso.'
      );
    }
  }
  console.log('UUID del token:', userLogged.credential_uuid);
  console.log('UUID de la ruta:', uuid);
  return this.credentialRepository.putChangeUsernameRepository(credentialExists, changeUsernameDto);  
}

//Cambiar la contraseña (solo el dueño de la cuenta)
async patchChangePasswordService(
  uuid: string,
  changePasswordDto: ChangePasswordDto,
  userLogged: any, // Viene del request
) {
    const { currentPassword, newPassword, confirmNewPassword } = changePasswordDto;
    //Verificar si la credencial existe
    const credentialExists = await this.credentialRepository.getCredentialByIdRepository(uuid);
    if (!credentialExists) {
      throw new NotFoundException('Esta credencial no existe.');
    }
    //Verificar si está desactivado
    if (credentialExists.isActive === false) {
      throw new ConflictException('Esta credencial está desactivada.');
    }
    //Asegurar que el usuario sea el dueño
    if (userLogged.credential_uuid !== uuid) {
      throw new UnauthorizedException('No tienes permisos para cambiar la contraseña.');
    }
    //Verificar la confirmación de la nueva contraseña
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('La nueva contraseña y su confirmación no coinciden.');
    }
    //Validar la contraseña actual
    const validatePassword = await bcrypt.compare(currentPassword, credentialExists.password);
    if (!validatePassword) {
      throw new BadRequestException('La contraseña actual es incorrecta.');
    }

    //Hashear la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    //Guardar el cambio en el repositorio
    return this.credentialRepository.patchChangePasswordRepository(
      credentialExists,
      hashedNewPassword,
    );
  }

  //Desactivar una cuenta (soft delete)
  async deleteCredentialService(
    uuid: string,
    userLogged: any, //Viene del request
  ) {
    //Validar si existen las credenciales
    const credentialExists = await this.credentialRepository.getCredentialByIdRepository(uuid);
    if (!credentialExists) {
      throw new NotFoundException('Esta credencial no existe.');
    }
    //Validar permisos
    const role = userLogged.role.toUpperCase();
    
    if (
      role !== 'ADMIN' &&
      userLogged.credential_uuid !== uuid
    ) {
      throw new UnauthorizedException('No tienes permisos para desactivar esta cuenta.');
    }
    //Verificar si ya está desactivada
    if (credentialExists.isActive === false) {
      throw new ConflictException('Este usuario ya no se encuentra activo.');
    }
    //Llamar al repositorio para hacer la desactivación en cascada de las credenciales y su perfil asociado
    return await this.credentialRepository.desactivateCredAndUserProfRepository(credentialExists);
  }

  //Re-activar una cuenta (y el perfil asociado)
  async activateCredentialService(
    uuid: string,
  ) {
    //Validar si existen las credenciales
    const credentialExists = await this.credentialRepository.getCredentialByIdRepository(uuid);
    if (!credentialExists) {
      throw new NotFoundException('Esta credencial no existe.');
    }
    //Verificar si ya está activada
    if (credentialExists.isActive === true) {
      throw new ConflictException('Este usuario ya se encuentra activo.');
    }
    //Llamar al repositorio para hacer la activación en cascada de las credenciales y su perfil asociado
    return await this.credentialRepository.activateCredAndUserProfRepository(credentialExists);
  }

  //Cambiar rol
  async putChangeUserRole(
    uuid: string, 
    changeRoleDto: ChangeRoleDto
  ) {
    //Validar si existen las credenciales
    const credentialExists = await this.credentialRepository.getCredentialByIdRepository(uuid);
    if (!credentialExists) {
      throw new NotFoundException('Esta credencial no existe.');
    }
    //Verificar si ya está tiene el rol que se va a actualizar
    if (credentialExists.role === changeRoleDto.role) {
      throw new ConflictException('Este usuario ya tiene este rol. No es necesario cambiarlo.');
    }
    return await this.credentialRepository.putChangeUserRoleRepository(credentialExists, changeRoleDto);
  }
}