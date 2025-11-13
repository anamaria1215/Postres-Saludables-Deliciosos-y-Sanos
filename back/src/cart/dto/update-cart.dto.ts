import { PartialType} from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateCartDto } from './create-cart.dto';


export class UpdateCartDto extends PartialType(CreateCartDto) {
   @IsNotEmpty({ message: 'El id del carrito es obligatorio' })
  @IsUUID('4', { message: 'El id del carrito debe tener un formato UUID' })
  uuid: string;
}