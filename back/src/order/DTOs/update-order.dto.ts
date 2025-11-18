import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDetailDto } from './create-order.dto'; // corregido el nombre

export class UpdateOrderDetailDto extends PartialType(CreateOrderDetailDto) {}
