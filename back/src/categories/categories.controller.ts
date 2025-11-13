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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enum/roles.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Categories') // Agrupa las rutas en Swagger
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Listar todas las categorías
   * Ruta pública, sin autenticación.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida con éxito.' })
  findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * Obtener una categoría por UUID
   * Ruta pública.
   */
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener una categoría por UUID' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  findOne(@Param('uuid') uuid: string) {
    return this.categoriesService.findOne(uuid);
  }

  /**
   * Crear una nueva categoría
   * Solo accesible por administradores autenticados.
   */
  @Post()
  @ApiBearerAuth() // Muestra el candado de autenticación JWT en Swagger
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva categoría (solo admin)' })
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
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  /**
   * Actualizar una categoría existente
   * Solo accesible por administradores autenticados.
   */
  @Patch(':uuid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Actualizar una categoría existente (solo admin)' })
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
  @ApiResponse({ status: 200, description: 'Categoría actualizada con éxito.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @ApiResponse({ status: 400, description: 'Error al actualizar la categoría.' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(uuid, dto);
  }

  /**
   * Eliminar una categoría
   * Solo accesible por administradores autenticados.
   */
  @Delete(':uuid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Eliminar una categoría existente (solo admin)' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  delete(@Param('uuid') uuid: string) {
    return this.categoriesService.delete(uuid);
  }
}
