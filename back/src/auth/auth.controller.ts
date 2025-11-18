import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from 'src/credential/DTOs/sing-up.dto';
import { LoginDto } from 'src/credential/DTOs/login.dto';

@ApiTags('Registro y autenticación')
@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {}

    //Registro

    @Post('sign-up')
    @ApiOperation({ summary: 'Registrar un usuario | PÚBLICA.', description: 'Permite crear una nueva cuenta con sus respectivos credenciales y perfil de usuario.' })
    @ApiBody({ description: 'Datos necesarios para registrar una nueva cuenta.', type: SignUpDto })
    @ApiResponse({ status: 201, description: 'Nueva cuenta de usuario y su perfil creados exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() signUpDto: SignUpDto) {
      return this.authService.signUpService(signUpDto);
    }

    //Ruta para el login
    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión | PÚBLICA', description: 'Valida las credenciales del usuario y retorna un token al iniciar sesión.' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
    @HttpCode(HttpStatus.OK)
    signIn(@Body() loginDto: LoginDto) {
      return this.authService.signInService(loginDto);
    }
}