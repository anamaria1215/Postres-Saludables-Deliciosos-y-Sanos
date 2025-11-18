import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { MatchPassword } from "src/decorators/match-password.decorator";

export class CreateCredentialDto {
    @ApiProperty({
        description: 'Nombre de usuario. Debe ser único.',
        example: 'anamaria_23',
    })
    @IsNotEmpty({
        message: 'El nombre de usuario es obligatorio.'
    })
    @IsString({
        message: 'El nombre de usuario debe ser una cadena de caracteres',
    })
    @Matches(/^[a-zA-Z0-9_-]{3,20}$/, {
        message: 'El nombre de usuario solo puede contener letras, números, guiones bajos o medios (y debe contener entre 3–20 caracteres).'
    })
    username: string;

    @ApiProperty({
        description: 'Contraseña que cumpla con mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo o caracter especial.',
        example: 'Micontras3na74*',
    })
    @IsNotEmpty({ 
        message: 'La contraseña es obligatoria.' 
    })
    @IsString({ 
        message: 'La contraseña debe ser una cadena de caracteres.' 
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?_~\-])[A-Za-z\d!@#$%^&*?_~\-]{8,}$/,
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial',
    })
    password: string;

    @ApiProperty({
        description: 'Confirmación de la contraseña. Debe coincidir con la contraseña ingresada.',
        example: 'Micontras3na74*',
    })
    @MatchPassword('password', {
        message: 'Las contraseñas no coinciden'
    })
    confirmPassword: string;
}