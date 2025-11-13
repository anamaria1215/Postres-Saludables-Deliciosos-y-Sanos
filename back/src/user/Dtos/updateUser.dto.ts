import { IsOptional, IsString, IsEmail, Matches, MaxLength, MinLength, IsDateString, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(25, { message: 'El nombre no debe exceder los 25 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'El apellido solo puede contener letras y espacios' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  address?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  email?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El número de teléfono debe ser numérico' })
  phoneNumber?: number;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)' })
  birthDay?: Date;
}