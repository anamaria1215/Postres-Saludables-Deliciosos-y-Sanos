import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  // Obtiene todas las categorías
  findAll(): Promise<Category[]> {
    return this.repository.find();
  }

  // Crea una nueva categoría
  createCategory(data: Partial<Category>): Promise<Category> {
    const newCategory = this.repository.create(data);
    return this.repository.save(newCategory);
  }
}
