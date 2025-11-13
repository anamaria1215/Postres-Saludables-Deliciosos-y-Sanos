import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /** Obtener todas las categorías */
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  /** Buscar una categoría por UUID */
  async findOne(uuid: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { uuid } });
    if (!category)
      throw new NotFoundException(`❌ No se encontró ninguna categoría con ID: ${uuid}`);
    return category;
  }

  /**  Crear una nueva categoría */
  async create(dto: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory = this.categoryRepository.create(dto);
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      throw new BadRequestException(
        '⚠️ Ocurrió un error al crear la categoría. Verifica los datos enviados.',
      );
    }
  }

  /** Actualizar una categoría existente */
  async update(uuid: string, dto: UpdateCategoryDto): Promise<Category> {
    const existing = await this.findOne(uuid);
    try {
      Object.assign(existing, dto);
      return await this.categoryRepository.save(existing);
    } catch {
      throw new BadRequestException(
        `⚠️ Error al actualizar la categoría con ID: ${uuid}. Verifica los datos.`,
      );
    }
  }

  /** Eliminar una categoría */
  async delete(uuid: string): Promise<boolean> {
    const result = await this.categoryRepository.delete({ uuid });
    if (!result.affected)
      throw new NotFoundException(
        `❌ No se pudo eliminar la categoría. ID ${uuid} no encontrado.`,
      );
    return true;
  }
}
