import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateCartDetailDto {
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity: number;

  @IsNotEmpty({ message: 'El precio unitario es requerido' })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  unitPrice: number;

  @IsNotEmpty({ message: 'El subtotal es requerido' })
  @IsNumber({}, { message: 'El subtotal debe ser un número' })
  subTotal: number;

  @IsUUID()
  @IsNotEmpty({ message: 'El carrito es obligatorio y debe ser un UUID válido' })
  cartUuid: string;

  @IsUUID()
  @IsNotEmpty({ message: 'El producto es obligatorio y debe ser un UUID válido' })
  productUuid: string;
}