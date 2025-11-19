import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateProductQuantityDto {
  @ApiProperty({
    description: 'Es la cantidad del producto que se va a actualizar en el carrito.',
    example: 5,
  })
  @IsNotEmpty({
    message: 'La cantidad es obligatoria.'
  })
  @IsNumber({}, {
    message: 'La cantidad debe ser un número.',
  })
  @Min(1, {
    message: 'La cantidad mínima para actualizar al carrito es 1.',
  })
  quantity: number;
}
