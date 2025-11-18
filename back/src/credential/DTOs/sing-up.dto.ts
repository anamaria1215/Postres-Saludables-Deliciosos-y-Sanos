import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCredentialDto } from './create-credential.dto';
import { CreateUserDto } from 'src/user/Dtos/create-user.dto';

export class SignUpDto {
  @ApiProperty({
    type: CreateCredentialDto,
    description: 'Datos necesarios para la creación de las credenciales del usuario.',
  })
  @ValidateNested()
  @Type(() => CreateCredentialDto)
  createCredentialDto: CreateCredentialDto;

  @ApiProperty({
    type: CreateUserDto,
    description: 'Datos personales del usuario para crear el perfil de usuario asociado.',
  })
  @ValidateNested()
  @Type(() => CreateUserDto)
  createUserDto: CreateUserDto;
}
