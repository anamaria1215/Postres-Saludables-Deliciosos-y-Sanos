import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({
        description: 'Es la contraseña actual del usuario.',
        example: 'Moni19820*',
    })
    @IsNotEmpty({
        message: 'La contraseña actual es obligatoria.'
    })
    @IsString({ 
        message: 'La contraseña actual debe ser una cadena de caracteres.'
    })
    currentPassword: string;

    @ApiProperty({
        description: 'Es la nueva contraseña del usuario.',
        example: 'Moni19814*',
    })
    @IsNotEmpty({
        message: 'La nueva contraseña es obligatoria.'
    })
    @IsString({ 
        message: 'La nueva contraseña debe ser una cadena de caracteres.' 
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?_~\-])[A-Za-z\d!@#$%^&*?_~\-]{8,}$/,
        {
        message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial',
        }
    )
    newPassword: string;

    @ApiProperty({
        description: 'Es la confirmación de la nueva contraseña del usuario. Debe coincidir con la nueva contraseña.',
        example: 'Moni19814*',
    })
    @IsNotEmpty({
        message: 'La confirmación de la nueva contraseña es obligatoria.'
    })
    @IsString({
        message: 'La confirmación de la contraseña debe ser una cadena de caracteres.'
    })
    confirmNewPassword: string;
}

