import { Controller, Get, Post, Delete, Param, Body, UseGuards, HttpCode, HttpStatus, ParseUUIDPipe, Req, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enum/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateOrderDto } from './DTOs/udapte-order.dto';

@ApiTags('Órdenes de compra') // Agrupa los endpoints
@ApiBearerAuth()  // activa el candadito
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //Rutas del admin

  //Ver todos los pedidos 
  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las órdenes | ADMIN.', description: 'Permite obtener un listado con todas las órdenes del sistema.' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes obtenida correctamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN)
  getAllOrders(){
    return this.orderService.getAllOrdersService();
  } 

  //Actualizar el estado de una orden
  @Put('update-status/:uuid')
  @ApiOperation({ summary: 'Actualizar el estado de una orden | ADMIN.', description: 'Permite actualizar el estado de una orden en el sistema.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la orden a actualizar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiBody({ description: 'Datos necesarios para actualizar una orden.', type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Estado de la orden actualizado exitosamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN)
  putOrderStatus(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return this.orderService.putOrderStatusService(uuid, updateOrderDto);
  } 

  //Eliminar una orden (soft delete)
  @Delete('delete/:uuid')
  @ApiOperation({ summary: 'Eliminar una orden | ADMIN.',description: 'Elimina una orden del sistema (soft delete). La marca con estado ELIMINADA.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la orden a eliminar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Orden eliminada correctamente (soft delete).' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN)
  deleteOrder(@Param('uuid') uuid: string) {
    return this.orderService.deleteOrderService(uuid);
  }

  //Rutas del user

  //Crear una orden a partir del carrito activo
  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva orden | USER', description: 'Permite a un usuario crear una nueva orden a partir de su carrito activo.' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente.' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.USER)
  postCreateOrder(
  @Req() req, //No se necesita un Dto, se crea apartir del carrito activo
  ){
    return this.orderService.postCreateOrderService(req);
  } 

  //Ver historial de pedidos
  @Get('history')
  @ApiOperation({ summary: 'Ver el historial de pedidos | USER', description: 'Permite a un usuario ver su historial de pedidos hechos.' })
  @ApiResponse({ status: 200, description: 'Historial obtenido exitosamente.' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.USER)
  getOrdersHistory(
      @Req() req //Asegurar que el historial de pedidos sea el propio
  ){
      return this.orderService.getOrdersHistoryService(req);
  }

  //Cancelar un pedido (solo si su estado aún no es “En camino”). O sea no tiene domicilio registrado.
  //El usuario solo puede pasar a estado cancelado
  @Put('cancel/:uuid')
  @ApiOperation({ summary: 'Cancelar un pedido | USER', description: 'Permite a un usuario cancelar una orden, pero solo si aun no tiene domicilio registrado.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la orden a cancelar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Orden cancelada exitosamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.USER)
  putCancelOrder(
    @Req() req, //Asegurar que el usuario va a cancelar una orden que le pertenece
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.orderService.putCancelOrderService(req, uuid);
  }  

  //Rutas compartidas

  //Obtener orden por Id 
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener una orden por UUID | ADMIN Y USER', description: 'Permite obtener una orden específica mediante su UUID. Los administradores pueden acceder a cualquier orden, mientras que los usuarios solo pueden acceder a sus propias órdenes.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la orden a consultar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Orden encontrada correctamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  getOrderById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req
  ) {
    return this.orderService.getOrderByIdService(uuid, req);
  } 
}
