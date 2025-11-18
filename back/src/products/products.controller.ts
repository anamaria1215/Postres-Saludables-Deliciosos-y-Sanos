import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enum/roles.enum';

// Swagger imports
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Productos') // Agrupa las rutas en Swagger bajo "Products"
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Ruta pública: ver todos los productos
  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los productos activos | PÚBLICA.', description: 'Permite obtener la lista de todos los productos activos disponibles.' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida correctamente.' })        
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.productsService.getAllProducts();
  }

  // Ruta pública: ver producto por ID
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener un producto por UUID | PÚBLICA.', description: 'Permite obtener un producto específico por su UUID.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID del producto a consultar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Producto obtenido correctamente.' })
  @HttpCode(HttpStatus.OK)
  getById(@Param('uuid') uuid: string) {
    return this.productsService.getProductById(uuid);
  }

  // Solo ADMIN puede crear productos
  @Post('create')
  @ApiOperation({ summary: 'Crear nuevo producto | ADMIN.', description: 'Permite crear un nuevo producto en el sistema. Solo accesible para usuarios con rol ADMIN.' })
  @ApiBody({ description: 'Datos necesarios para crear un producto.', type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente.' })
  @ApiBearerAuth() // Añade el candado de autorización (Bearer JWT)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  // Solo ADMIN puede actualizar productos
  @Patch('update/:uuid')
  @ApiOperation({ summary: 'Actualizar producto por UUID | ADMIN.', description: 'Permite actualizar los datos de un producto existente. Solo accesible para usuarios con rol ADMIN.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID del producto a actualizar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiBody({ description: 'Datos para actualizar el producto.', type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Producto actualizado correctamente.' })
  @ApiBearerAuth() // Añade el candado de autorización (Bearer JWT)
  @HttpCode(HttpStatus.OK)  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  update(
    @Param('uuid') uuid: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(uuid, updateProductDto);
  }

  // Solo ADMIN puede eliminar productos
  @Delete('delete/:uuid')
  @ApiOperation({ summary: 'Eliminar producto (borrado lógico) | ADMIN', description: 'Permite eliminar un producto mediante un borrado lógico. Solo accesible para usuarios con rol ADMIN.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID del producto a eliminar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Producto eliminado correctamente.' })
  @ApiBearerAuth() // Añade el candado de autorización (Bearer JWT)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  delete(@Param('uuid') uuid: string) {
    return this.productsService.deleteProduct(uuid);
  }
}
