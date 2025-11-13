import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,

    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async getAllProducts() {
    return await this.productsRepository.getAllProductsRepository();
  }

  async getProductById(uuid: string) {
    const product = await this.productsRepository.getProductById(uuid);
    if (!product)
      throw new NotFoundException(`Producto con ID ${uuid} no encontrado`);
    return product;
  }

  async createProduct(createProductDto: CreateProductDto) {
    const { categoryUuid } = createProductDto;

    // Verificar si existe la categoría
    const category = await this.categoriesRepository.findOne({
      where: { uuid: categoryUuid },
    });

    if (!category) {
      throw new NotFoundException(
        `La categoría con ID ${categoryUuid} no existe`,
      );
    }

    try {
      return await this.productsRepository.createProductRepository(
        createProductDto,
      );
    } catch (error) {
      throw new BadRequestException(
        `Error al crear producto: ${error.message}`,
      );
    }
  }

  async updateProduct(uuid: string, updateProductDto: UpdateProductDto) {
    const existing = await this.productsRepository.getProductById(uuid);
    if (!existing)
      throw new NotFoundException(`Producto con ID ${uuid} no encontrado`);

    try {
      return await this.productsRepository.updateProductRepository(
        existing,
        updateProductDto,
      );
    } catch (error) {
      throw new BadRequestException(
        `Error al actualizar producto: ${error.message}`,
      );
    }
  }

  async deleteProduct(uuid: string) {
    const existing = await this.productsRepository.getProductById(uuid);
    if (!existing)
      throw new NotFoundException(`Producto con ID ${uuid} no encontrado`);

    try {
      return await this.productsRepository.deleteProductsRepository(existing);
    } catch (error) {
      throw new BadRequestException(
        `Error al eliminar producto: ${error.message}`,
      );
    }
  }
}
