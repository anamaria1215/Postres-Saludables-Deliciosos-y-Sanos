import { Controller, Param, UseGuards, Get, HttpCode, HttpStatus, ParseUUIDPipe, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDetailService } from './orderDetail.service';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enum/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Detalles de la orden')
@ApiBearerAuth()
@Controller('order-details')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  //Rutas del admin

  //Ver todos los detalles que componen una orden por su UUID (lectura)
  @Get('admin/:uuid')
  @ApiOperation({ summary: 'Ver todos los detalles de una orden | ADMIN.', description: 'Permite obtener todos los detalles que componen cualquier orden.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la orden a consultar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Lista de detalles de la orden obtenida correctamente.' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  getOrderDetailsAdmin(
    @Param('uuid', ParseUUIDPipe) uuid: string //El UUID de la orden
  ){
    return this.orderDetailService.getOrderDetailsAdminService(uuid);
  }

  //Rutas del user

  //Ver todos los detalles que componen una orden por su UUID (lectura)
  @Get('user/:uuid')
  @ApiOperation({ summary: 'Ver todos los detalles de una orden | USER.', description: 'Permite obtener todos los detalles de una orden propia.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la orden a consultar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Lista de detalles de la orden obtenida correctamente.' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.USER)
  getOrderDetailUser(
    @Req() req,
    @Param('uuid', ParseUUIDPipe) uuid: string //El UUID de la orden
  ){
    return this.orderDetailService.getOrderDetailsUserService(
      req, 
      uuid
    );
  }
}
