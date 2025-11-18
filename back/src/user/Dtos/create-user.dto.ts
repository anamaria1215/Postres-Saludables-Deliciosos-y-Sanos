import { ApiProperty } from "@nestjs/swagger";
import { 
    IsEmail,
    IsNotEmpty, 
    IsString, 
    Matches, 
    MaxLength, 
    MinLength 
} from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: 'Es el nombre del usuario. Primer y segundo nombre (si tiene).',
        example: 'Ana Milena',
    })
    @IsNotEmpty ({ 
        message: 'El nombre es obligatorio.' 
    })
    @IsString({ 
        message: 'El nombre debe ser una cadena de caracteres.' 
    })
    @Matches(/^\p{L}+(?: \p{L}+)*$/u, { 
        message: 'El nombre debe contener solo letras y espacios.'
    })
    @MinLength(3, { 
        message: 'El nombre debe contener minimo 3 caracteres.'
    })
    @MaxLength(25, {
        message: 'El nombre debe contener máximo 25 caracteres.'
    })
    name: string;

    @ApiProperty({
        description: 'Es el apellido o los apellidos del usuario (si tiene segundo apellido).',
        example: 'Reyes Castro',
    })
    @IsNotEmpty ({ 
        message: 'El apellido es obligatorio.' 
    })
    @IsString({ 
        message: 'El apellido debe ser una cadena de caracteres.' 
    })
    @Matches(/^\p{L}+(?: \p{L}+)*$/u, { 
        message: 'El apellido debe contener solo letras y espacios.'
    })
    @MinLength(3, { 
        message: 'El apellido debe contener minimo 3 caracteres.'
    })
    @MaxLength(25, {
        message: 'El apellido debe contener máximo 25 caracteres.'
    })
    lastName: string;

    @ApiProperty({
        description: 'Correo electrónico válido.',
        example: 'correousuario@example.com',
    })
    @IsNotEmpty({
        message: 'El correo electrónico es obligatorio.'
    })
    @IsEmail({}, {
        message: 'El formato del correo electrónico no es válido.'
    })
    @MaxLength(100, {
        message: 'El correo electrónico no puede contener más de 100 caracteres.'
    })
    email: string;

    @ApiProperty({
        description: 'Es el número de teléfono del usuario. Es un número colombiano con o sin el +57.',
        example: '3146780918',
    })
    @IsNotEmpty({ 
        message: 'El número de teléfono es obligatorio.' 
    })
    @IsString({ 
        message: 'El número de teléfono debe ser una cadena de caracteres.' 
    })
    @Matches(/^(?:\+57)?3\d{9}$/, { 
        message: 'El número de teléfono debe ser un número colombiano válido (+57 opcional).'
    })
    @MinLength(10, { 
        message: 'El número de teléfono debe contener mínimo 10 caracteres.'
    })
    @MaxLength(13, {
        message: 'El número de teléfono debe contener máximo 13 caracteres.'
    })
    phoneNumber: string;

    @ApiProperty({
        description: 'Es la dirección del usuario.',
        example: 'Calle 34 # 28 C - 38',
    })
    @IsNotEmpty({ 
        message: 'La dirreción es obligatoria.' 
    })
    @IsString({ 
        message: 'La dirreción debe ser una cadena de caracteres.' 
    })
    @MinLength(8, {
        message: 'La dirección debe contener mínimo 8 caracteres'
    })
    address: string;
}