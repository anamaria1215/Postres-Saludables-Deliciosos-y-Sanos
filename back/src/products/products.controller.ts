import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enum/roles.enum';

// Swagger imports
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Products') // Agrupa las rutas en Swagger bajo "Products"
@ApiBearerAuth() // Añade el candado de autorización (Bearer JWT)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Ruta pública: ver todos los productos
  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos activos (público)' })
  getAll() {
    return this.productsService.getAllProducts();
  }

  // Ruta pública: ver producto por ID
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener un producto por UUID (público)' })
  getById(@Param('uuid') uuid: string) {
    return this.productsService.getProductById(uuid);
  }

  // Solo ADMIN puede crear productos
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Crear nuevo producto (solo Admin)' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  // Solo ADMIN puede actualizar productos
  @Patch(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Actualizar producto por UUID (solo Admin)' })
  update(
    @Param('uuid') uuid: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(uuid, updateProductDto);
  }

  // Solo ADMIN puede eliminar productos
  @Delete(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Eliminar producto (borrado lógico, solo Admin)' })
  delete(@Param('uuid') uuid: string) {
    return this.productsService.deleteProduct(uuid);
  }
}
