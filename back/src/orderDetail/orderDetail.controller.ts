import { Controller, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDetailService } from './orderDetail.service';
import { OrderDetail } from '../entities/orderDetail.entity';
import { CreateOrderDetailDto } from './DTOs/create-orderDetail.dto';
import { UpdateOrderDetailDto } from './DTOs/update-orderDetail.dto';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enum/roles.enum';

@ApiTags('OrderDetail')
@ApiBearerAuth()
@Controller('order-details')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo detalle de orden (solo Usuario autenticado)' })
  @ApiResponse({ status: 201, description: 'Detalle de orden creado exitosamente.' })
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async create(@Body() dto: CreateOrderDetailDto): Promise<OrderDetail> {
    return this.orderDetailService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar detalle de orden (solo Admin)' })
  @ApiResponse({ status: 200, description: 'Detalle de orden actualizado correctamente.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDetailDto): Promise<OrderDetail> {
    return this.orderDetailService.update(id, dto);
  }
}
