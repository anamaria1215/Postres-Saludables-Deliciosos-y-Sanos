import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  /**
   * Crear un nuevo carrito
   */
  async create(dto: CreateCartDto): Promise<Cart> {
    try {
      const cart = this.cartRepository.create(dto);
      return await this.cartRepository.save(cart);
    } catch (error) {
      throw new BadRequestException('Error al crear el carrito');
    }
  }

  /**
   * Listar todos los carritos
   */
  async findAll(): Promise<Cart[]> {
    return await this.cartRepository.find({
      relations: ['product'], // si existe relación con productos
    });
  }

  /**
   * Buscar un carrito por UUID
   */
  async findOne(uuid: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { uuid },
      relations: ['product'],
    });

    if (!cart) {
      throw new NotFoundException(`No se encontró el carrito con uuid: ${uuid}`);
    }

    return cart;
  }

  /**
   * Actualizar un carrito existente
   */
  async update(uuid: string, dto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(uuid);

    Object.assign(cart, dto);

    try {
      return await this.cartRepository.save(cart);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el carrito');
    }
  }

  /**
   * Eliminar un carrito por UUID
   */
  async delete(uuid: string): Promise<{ message: string }> {
    const result = await this.cartRepository.delete({ uuid });

    if (result.affected === 0) {
      throw new NotFoundException(`No se encontró el carrito con uuid: ${uuid}`);
    }

    return { message: 'Carrito eliminado correctamente' };
  }
}