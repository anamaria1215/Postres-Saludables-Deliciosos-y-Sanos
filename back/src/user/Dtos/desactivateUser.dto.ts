import { IsBoolean, IsNotEmpty } from 'class-validator';

export class DeactivateUserDto {
  @IsNotEmpty({ message: 'El campo "active" es obligatorio' })
  @IsBoolean({ message: 'El campo "active" debe ser un valor booleano (true o false)' })
  active: boolean;
}