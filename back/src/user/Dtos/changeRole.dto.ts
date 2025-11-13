import { IsEnum, IsNotEmpty } from 'class-validator';
import { RolesEnum } from 'src/enum/roles.enum';

export class ChangeRoleDto {
  @IsNotEmpty({ message: 'El campo "role" es obligatorio' })
  @IsEnum(RolesEnum, { message: 'El rol debe ser "buyer" o "seller"' })
  role: RolesEnum;
}