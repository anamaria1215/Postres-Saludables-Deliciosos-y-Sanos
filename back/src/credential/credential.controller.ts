import { Controller, Get, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Query, ParseUUIDPipe, Req, Patch } from '@nestjs/common';
import { CredentialService } from './credential.service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enum/roles.enum';
import { ChangeUsernameDto } from './DTOs/change-username.dto';
import { ChangePasswordDto } from './DTOs/change-password.dto';
import { ChangeRoleDto } from './DTOs/change-role.dto';

@ApiTags('Credenciales de usuarios')
@ApiBearerAuth()
@Controller('credentials')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  //Rutas del admin
  
  //Obtener todas las credenciales (activas e inactivas)
  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las credenciales de usuarios | ADMIN.', description: 'Retorna la lista de credenciales (activas e inactivas). Si se envía el query "username", filtra por nombre de usuario.' })
  @ApiQuery({ name: 'username', required: false, description: 'Nombre de usuario para filtrar usuarios (opcional).' })
  @ApiResponse({ status: 200, description: 'Listado de credenciales de usuarios obtenido correctamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN)
  getAllCredentials(@Query('username') username: string) {
    //Filtro por username
    if (username) {
      return this.credentialService.getCredentialByUsernameService(username);
    }
    //Retorna todas
    return this.credentialService.getAllCredentialsService();
  }

  //Obtener una credencial por Id (activo o inactivo)
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener una credencial de usuario por su Id | ADMIN.', description: 'Retorna la credencial de usuario consultada por su Id.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la credencial de usuario a consultar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Credencial de usuario obtenida correctamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN)
  getCredentialById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.credentialService.getCredentialByIdService(uuid);
  }

  //Rutas compartidas

  //Actualizar username
  @Put('change-username/:uuid')
  @ApiOperation({ summary: 'Actualizar nombre de usuario | ADMIN Y USER.', description: 'Modifica el nombre de usuario (solo el propietario de la cuenta).'})
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la credencial de usuario a actualizar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiBody({ description: 'Datos necesarios para actualizar una credencial de usuario.', type: ChangeUsernameDto })
  @ApiResponse({ status: 200, description: 'Username actualizado correctamente.' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  putChangeUsername(
    @Param('uuid', ParseUUIDPipe) uuid:string,
    @Body() changeUsernameDto: ChangeUsernameDto,
    @Req() req
  ) {
    return this.credentialService.putChangeUsernameService(
      uuid, 
      changeUsernameDto, 
      req.user
    );
  }

  //Cambiar la contraseña (solo el dueño de la cuenta)
  @Patch('change-password/:uuid')
  @ApiOperation({ summary: 'Cambiar contraseña | ADMIN Y USER.', description: 'Permite cambiar la contraseña personal del usuario (solo el propietario de la cuenta).' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la credencial de usuario a actualizar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiBody({ description: 'Datos necesarios para cambiar una contraseña ', type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Contraseña modificada correctamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  patchChangePassword(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req
  ) {
    return this.credentialService.patchChangePasswordService(
      uuid,
      changePasswordDto,
      req.user,
    );
  }

  //Desactivar una cuenta (soft delete) (y el perfil asociado)
  @Delete('desactivate/:uuid')
  @ApiOperation({ summary: 'Desactivar una credencial de usuario existente | ADMIN Y USER.', description: 'Desactiva una credencial de usuario y su perfil de usuario asociado. Admin puede desactivar cualquier credencial y User solo su propia cuenta.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la credencial de usuario a desactivar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Credencial y su perfil asociado desactivados correctamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  deleteCredential(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req
  ) {
    return this.credentialService.deleteCredentialService(uuid, req.user);
  }

  //Re-activar una cuenta (y el perfil asociado)
  @Put('activate/:uuid')
  @ApiOperation({ summary: 'Activar una credencial de usuario previamente desactivada | ADMIN.', description: 'Activa una credencial de usuario y su perfil de usuario asociado. Solo el Admin puede reactivar una cuenta.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la credencial de usuario a activar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Credencial y su perfil asociado activados correctamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN)
  activateCredential(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.credentialService.activateCredentialService(uuid);
  }

  //Cambiar rol
  @Put('change-role/:uuid')
  @ApiOperation({ summary: 'Cambiar el rol | ADMIN.', description: 'Cambia el rol del Admin a User o viceversa (solo administradores pueden cambiar su rol).' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la credencial de usuario a cambiar de rol.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Rol del usuario cambiado correctamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN)
  putChangeUserRole(
    @Param('uuid', ParseUUIDPipe) uuid: string, 
    @Body() changeRoleDto: ChangeRoleDto
  ) {
    return this.credentialService.putChangeUserRole(uuid, changeRoleDto);
  }
}