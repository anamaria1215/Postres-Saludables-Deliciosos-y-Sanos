import { IsUUID, IsInt, IsDecimal } from 'class-validator';

export class CreateOrderDetailDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;

  @IsDecimal()
  unitPrice: number;

  @IsDecimal()
  subtotal: number;
}
