import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enum/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './Dtos/updateUser.dto';
import { UserService } from './user.service';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Rutas del admin

  //Obtener todos los usuarios
  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los usuarios | ADMIN.', description: 'Retorna la lista de todos los perfiles de usuario (activas e inactivas). Si se envía el query "name" y "lastName, filtra por nombre y apellido del usuario. Pero si solo se envía el query de "name",  filtra solo por nombre del usuario.' })
  @ApiQuery({ name: 'name', required: false, description: 'Nombre del usuario (opcional). Incluir primer y segundo nombre si el usuario lo tiene).' })
  @ApiQuery({ name: 'lastName', required: false, description: 'Apellido del usuario (opcional, pero debe estar acompañado del query de nombre). Incluir primer y segundo apellido si el usuario lo tiene.' })
  @ApiResponse({ status: 200, description: 'Listado de perfiles de usuario obtenido correctamente.' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido filtrando por nombre(s) del usuario.' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido filtrando por nombre(s) y apellido(s) del usuario.' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  getAllUsers(
      @Query('name') name?: string,
      @Query('lastName') lastName?: string,
  ){
    //Para filtrar por el nombre y el apellido
    if (name && lastName) {
      return this.userService.getUserByNameAndLastNameService(name, lastName)
    }
    //Para filtrar por el nombre
    if (name) {
      return this.userService.getUserByNameService(name);    
    }
    //Si no viene ninguno, retorna todos
    return this.userService.getAllUsersService();
  }

  //Consultar un usuario por Id
  @Get('find/:uuid')
  @ApiOperation({ summary: 'Obtener un usuario por su Id | ADMIN.', description: 'Retorna el perfil de usuario consultado con su Id.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID del perfil de usuario a consultar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Perfil de usuario obtenido correctamente.' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  getUserById(@Param('uuid', ParseUUIDPipe) uuid: string){
    return this.userService.getUserByIdService(uuid);
  }
  
  //Rutas compartidas

  //Ver el perfil de usuario propio
  @Get('my-profile')
  @ApiOperation({ summary: 'Ver mi perfil | ADMIN Y USER.', description: 'Retorna la información del perfil del usuario autenticado.' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido correctamente.' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.USER, RolesEnum.ADMIN)
  getUserProfile(@Req() req){
      return this.userService.getUserProfileService(req);
  }

  //Actualizar datos personales básicos
  @Put('update-my-profile')
  @ApiOperation({ summary: 'Actualizar mi perfil. | ADMIN Y USER.', description: 'Permite actualizar la información básica del usuario autenticado.'})
  @ApiBody({ description: 'Datos necesarios para actualizar el perfil.', type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Perfil actualizado correctamente.' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.USER, RolesEnum.ADMIN)
  putUpdateUserProfile(
      @Req() req,
      @Body() updateUserDto: UpdateUserDto
  ){
      return this.userService.putUpdateUserProfileService(req, updateUserDto);
  }
}