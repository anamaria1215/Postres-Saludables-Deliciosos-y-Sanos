import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(25, { message: 'El nombre no debe exceder los 25 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'El apellido solo puede contener letras y espacios' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  lastName: string;

  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @IsString()
  address: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  @IsNumber({}, { message: 'El número de teléfono debe ser un número' })
  phoneNumber: number;

  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  birthDay: Date;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  username: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}