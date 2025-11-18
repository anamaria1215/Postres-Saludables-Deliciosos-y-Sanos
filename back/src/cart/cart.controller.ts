import {
  Controller,
  Get,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enum/roles.enum';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Carrito') // Agrupa las rutas en Swagger
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //Rutas del user

  //Obtener el carrito activo (si no existe, lo crea automáticamente)
  @Get('get')
  @ApiOperation({ summary: 'Obtener carrito activo | USER.', description: 'Permite obtener el carrito activo del usuario, si no tiene uno, se crea automáticamente con este estado.' })
  @ApiResponse({ status: 200, description: 'Carrito obtenido exitosamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.USER)
  getNewCart(@Req() req){
    const userUuid = req.user.user_uuid; //Viene del JWT
    return this.cartService.getNewCartService(userUuid);
  } 

  //Vaciar todo el carrito
  @Delete('empty')
  @ApiOperation({ summary: 'Vaciar el carrito activo | USER.', description: 'Permite vaciar el carrito activo del usuario.' })
  @ApiResponse({ status: 200, description: 'Carrito vaciado exitosamente.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.USER)
  deleteCart(@Req() req){
    const userUuid = req.user.user_uuid;
    return this.cartService.deleteCartService(userUuid);
  } 

  //Rutas del admin

  //Listar todos los carritos
  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los carritos | ADMIN', description: 'Permite al administrador obtener una lista de todos los carritos existentes en el sistema.' })
  @ApiResponse({ status: 200, description: 'Lista de carritos obtenida con éxito.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN)
  getAllCarts() {
    return this.cartService.getAllCartsService();
  }

  //Obtener un carrito por UUID
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener un carrito por su Id | ADMIN', description: 'Permite al administrador obtener los detalles de un carrito específico utilizando su UUID.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID del carrito a consultar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Carrito encontrado y retornado correctamanete.' })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.ADMIN)
  getCartById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.cartService.getCartByIdService(uuid);
  }
}
