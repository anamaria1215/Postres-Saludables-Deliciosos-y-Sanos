import { PartialType} from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateCartDetailDto } from './create-cartdetail.dto';


export class UpdateCartDetailDto extends PartialType(CreateCartDetailDto) {
   @IsNotEmpty({ message: 'El id del carrito es obligatorio' })
  @IsUUID('4', { message: 'El id del carrito debe tener un formato UUID' })
  uuid: string;
}