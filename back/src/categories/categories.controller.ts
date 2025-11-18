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
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enum/roles.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Categorias') // Agrupa las rutas en Swagger
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Listar todas las categorías
   * Ruta pública, sin autenticación.
   */
  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las categorías | PÚBLICA.', description: 'Permite obtener una lista de todas las categorías disponibles.' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida con éxito.' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * Obtener una categoría por UUID
   * Ruta pública.
   */
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener una categoría por UUID | PÚBLICA.', description: 'Permite obtener los detalles de una categoría específica utilizando su UUID.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la categoria a consultar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Categoría encontrada.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.categoriesService.findOne(uuid);
  }

  /**
   * Crear una nueva categoría
   * Solo accesible por administradores autenticados.
   */
  @Post('new')
  @ApiBearerAuth() // Muestra el candado de autenticación JWT en Swagger
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva categoría | ADMIN.', description: 'Permite a los administradores crear una nueva categoría.' })
  @ApiBody({
    description: 'Datos requeridos para crear una categoría',
    type: CreateCategoryDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de categoría',
        value: { name: 'Postres' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Categoría creada con éxito.' })
  @ApiResponse({ status: 400, description: 'Error al crear la categoría.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  /**
   * Actualizar una categoría existente
   * Solo accesible por administradores autenticados.
   */
  @Patch('update/:uuid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Actualizar una categoría existente | ADMIN.', description: 'Permite a los administradores actualizar los detalles de una categoría utilizando su UUID.' })
  @ApiBody({
    description: 'Campos opcionales a actualizar',
    type: UpdateCategoryDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: { name: 'Galletas' },
      },
    },
  })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la categoria a actualizar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Categoría actualizada con éxito.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @ApiResponse({ status: 400, description: 'Error al actualizar la categoría.' })
  @HttpCode(HttpStatus.OK)
  update(@Param('uuid') uuid: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(uuid, dto);
  }

  /**
   * Eliminar una categoría
   * Solo accesible por administradores autenticados.
   */
  @Delete('delete/:uuid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Eliminar una categoría existente | ADMIN.', description: 'Permite a los administradores eliminar una categoría utilizando su UUID.' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'UUID de la categoria a eliminar.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
  })
  @ApiResponse({ status: 200, description: 'Categoría eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid') uuid: string) {
    return this.categoriesService.delete(uuid);
  }
}
