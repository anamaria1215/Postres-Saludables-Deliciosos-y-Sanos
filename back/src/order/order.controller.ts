import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Order } from '../entities/order.entity';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enum/roles.enum';

@ApiTags('Order') // Agrupa los endpoints
@ApiBearerAuth()  // activa el candadito
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes (solo Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes obtenida correctamente.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID (solo Admin o Usuario dueño)' })
  @ApiResponse({ status: 200, description: 'Orden encontrada correctamente.' })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden (solo Usuario autenticado)' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente.' })
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.USER)
  async create(@Body() orderData: Partial<Order>): Promise<Order> {
    return this.orderService.create(orderData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una orden (solo Admin)' })
  @ApiResponse({ status: 200, description: 'Orden eliminada correctamente.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return this.orderService.delete(id);
  }
}
