import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) {}

  findAll(): Promise<Cart[]> {
    return this.repository.find({ relations: ['cart_detail', 'user'] });
  }

  async findOne(uuid: string): Promise<Cart | null> {
    return this.repository.findOne({
      where: { uuid },
      relations: ['cart_detail', 'user'],
    });
    
  }

  async createCart(data: CreateCartDto): Promise<Cart> {
    const newCart = this.repository.create(data);
    return this.repository.save(newCart);
  }

  async updateCart(uuid: string, data: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(uuid);
    if (!cart) {
      throw new Error(`No se encontró el carrito con uuid: ${uuid}`);
    }
    Object.assign(cart, data);
    return this.repository.save(cart);
  }

  async deleteCart(uuid: string): Promise<boolean> {
    const result = await this.repository.delete({ uuid });
    return !!result.affected && result.affected > 0;
  }
}