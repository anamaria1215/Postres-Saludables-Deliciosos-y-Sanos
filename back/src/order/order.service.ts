import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['orderDetails', 'user'] });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderDetails', 'user'],
    });
  
    if (!order) {
      throw new NotFoundException(`La orden con id ${id} no existe`);
    }
  
    return order;
  }
  

  async create(orderData: Partial<Order>): Promise<Order> {
    const newOrder = this.orderRepository.create(orderData);
    return await this.orderRepository.save(newOrder);
  }

  async delete(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
