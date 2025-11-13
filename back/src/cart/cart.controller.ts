import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Cart') // Agrupa las rutas en Swagger
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Listar todos los carritos

   */
  @Get()
  // @ApiBearerAuth() // Muestra el candado de autenticación JWT en Swagger
//    @UseGuards(JwtAuthGuard, RolesGuard)
   // @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los carritos' })
  @ApiResponse({ status: 200, description: 'Lista de carritos obtenida con éxito.' })
  findAll() {
    return this.cartService.findAll();
  }

  /**
   * Obtener un carrito por UUID

   */
  @Get(':uuid')
  // @ApiBearerAuth() // Muestra el candado de autenticación JWT en Swagger
//    @UseGuards(JwtAuthGuard, RolesGuard)
   // @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Obtener un carrito por UUID' })
  @ApiResponse({ status: 200, description: 'Carrito encontrado.' })
  @ApiResponse({ status: 404, description: 'Carrito no encontrado.' })
  findOne(@Param('uuid') uuid: string) {
    return this.cartService.findOne(uuid);
  }

  /**
   * Crear un nuevo carrito
   * Ruta pública (accesible por usuarios)
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo carrito' })
  @ApiBody({
    description: 'Datos requeridos para crear un carrito',
    type: CreateCartDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de carrito',
        value: {
          addressDelivery: 'Calle 45 #10-22, Bogotá',
          dateCreated: '11/11/2025',
          deliveryDate: '13/11/2025',
          total: 85000,
          productUuid: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Carrito creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Error al crear el carrito.' })
  create(@Body() dto: CreateCartDto) {
    return this.cartService.create(dto);
  }

  /**
   * Actualizar un carrito existente
   * Ruta pública (ej. actualizar dirección o fecha antes de enviar)
   */
  @Patch(':uuid')
  @ApiOperation({ summary: 'Actualizar un carrito existente' })
  @ApiBody({
    description: 'Campos opcionales a actualizar',
    type: UpdateCartDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: {
          addressDelivery: 'Carrera 12 #5-60, Medellín',
          deliveryDate: '14/11/2025',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Carrito actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Carrito no encontrado.' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateCartDto) {
    return this.cartService.update(uuid, dto);
  }

  /**
   * Eliminar un carrito
   * Ruta pública (por si el usuario desea cancelar la compra)
   */
  @Delete(':uuid')
  @ApiOperation({ summary: 'Eliminar un carrito existente' })
  @ApiResponse({ status: 200, description: 'Carrito eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Carrito no encontrado.' })
  delete(@Param('uuid') uuid: string) {
    return this.cartService.delete(uuid);
  }
}