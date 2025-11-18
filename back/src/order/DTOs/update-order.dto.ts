import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/enum/order-status.enum';

export class UpdateOrderDto {
@ApiProperty({
    description: 'Estado al que se actualizará la order.',
    example: OrderStatus.ENTREGA_FALLIDA,
    enum: OrderStatus,
})
@IsEnum(OrderStatus, {
  message: 'La orden de pedido solo puede tener uno de los siguientes estados: Creada, Preparando, En camino, Entregada, Cancelada o Entrega fallida.'
})
status: string;
}