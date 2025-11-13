import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString({ message: 'El nombre de usuario debe ser texto' })
  username: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}