import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Es el nombre de usuario con el que se inicia sesión.',
        example: 'ana_7',
    })
    @IsNotEmpty({
        message: 'El nombre de usuario es obligatorio.',
    })
    @IsString({
        message: 'El nombre de usuario debe ser una cadena de caracteres.',
    })
    username: string

    @ApiProperty({
        description: 'Es la contraseña del usuario.',
        example: 'Ana123456@',
    })
    @IsNotEmpty({
        message: 'La contraseña es obligatoria.'
    })
    @IsString({
        message: 'La contraseña debe ser una cadena de caracteres.'
    })
    password: string;
}