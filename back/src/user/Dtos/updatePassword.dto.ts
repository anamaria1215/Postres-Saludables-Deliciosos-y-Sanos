import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'La contraseña actual es obligatoria' })
  oldPassword: string;

  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  @MaxLength(20, { message: 'La nueva contraseña no debe exceder los 20 caracteres' })
  newPassword: string;
}
