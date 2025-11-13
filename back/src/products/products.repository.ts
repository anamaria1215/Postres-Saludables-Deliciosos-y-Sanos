// src/products/products.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsDB: Repository<Product>,
  ) {}

  // Obtener todos los productos activos
  async getAllProductsRepository() {
    return await this.productsDB.find({
      where: { isActive: true },
    });
  }

  // Obtener producto por UUID
  async getProductById(uuid: string) {
    return await this.productsDB.findOne({
      where: { uuid, isActive: true },
    });
  }

  // Crear un nuevo producto
  async createProductRepository(createProductDto: CreateProductDto) {
    const newProduct = this.productsDB.create({
      ...createProductDto,
      createdAt: new Date(), // agregado
    });
    await this.productsDB.save(newProduct);
    return newProduct;
  }

  // Actualizar un producto existente
  async updateProductRepository(
    productExisting: Product,
    updateProductDto: UpdateProductDto,
  ) {
    productExisting.name = updateProductDto.name ?? productExisting.name;
    productExisting.description =
      updateProductDto.description ?? productExisting.description;
    productExisting.price = updateProductDto.price ?? productExisting.price;
    productExisting.stock = updateProductDto.stock ?? productExisting.stock;
    productExisting.updatedAt = new Date(); // agregado

    await this.productsDB.save(productExisting);
    return productExisting;
  }

  // Borrado lógico (soft delete)
  async deleteProductsRepository(productExisting: Product) {
    productExisting.isActive = false;
    await this.productsDB.save(productExisting);
    return {
      message: `El producto "${productExisting.name}" ha sido desactivado correctamente.`,
    };
  }

  // Buscar producto por nombre
  async getProductByName(name: string) {
    return await this.productsDB.findOne({
      where: { name, isActive: true },
    });
  }
}
