import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RolesEnum } from 'src/enum/roles.enum';

export class ChangeRoleDto {
  @ApiProperty({
    description: 'Rol al que se desea cambiar el usuario.',
    example: RolesEnum.USER,
    enum: RolesEnum,
  })
  @IsNotEmpty({ message: 'El campo "role" es obligatorio.' })
  @IsEnum(RolesEnum, { message: 'El rol debe ser "Admin" o "User".' })
  role: RolesEnum;
}