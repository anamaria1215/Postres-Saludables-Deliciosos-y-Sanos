import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class AddProductDto {
  @ApiProperty({
    description: 'UUID del producto a agregar al carrito.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c4',
  })
  @IsUUID('4', { 
    message: 'El Id del producto debe ser un UUID válido.' 
  })
  @IsNotEmpty({
    message: 'El Id del producto para agregarlo al carrito es obligatorio.'
  })
  product_uuid: string;

  @ApiProperty({
    description: 'Es la cantidad del producto que se va a agregar al carrito.',
    example: 3,
  })
  @IsNotEmpty({
    message: 'La cantidad es obligatoria.'
  })
  @IsNumber({}, {
    message: 'La cantidad debe ser un número.',
  })
  @Min(1, {
    message: 'La cantidad mínima para agregar al carrito es 1.',
  })
  quantity: number;
}
