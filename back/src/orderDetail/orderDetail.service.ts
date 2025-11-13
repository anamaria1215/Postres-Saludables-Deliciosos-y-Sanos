import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from '../entities/orderDetail.entity';
import { CreateOrderDetailDto } from './DTOs/create-orderDetail.dto';
import { UpdateOrderDetailDto } from './DTOs/update-orderDetail.dto';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  // Crear un nuevo detalle de orden
  async create(createOrderDetailDto: CreateOrderDetailDto): Promise<OrderDetail> {
    // Primero creamos la entidad base
    const newOrderDetail = this.orderDetailRepository.create({
      quantity: createOrderDetailDto.quantity,
      unitPrice: createOrderDetailDto.unitPrice,
      subtotal: createOrderDetailDto.subtotal,
    });

    // Luego asignamos las relaciones (para evitar el error TS2769)
    (newOrderDetail as any).order = { id: createOrderDetailDto.orderId };
    (newOrderDetail as any).product = { id: createOrderDetailDto.productId };

    // Finalmente guardamos en base de datos
    return await this.orderDetailRepository.save(newOrderDetail);
  }

  // Obtener todos los detalles de orden
  async findAll(): Promise<OrderDetail[]> {
    return await this.orderDetailRepository.find({
      relations: ['order', 'product'],
    });
  }

  // Buscar un detalle específico
  async findOne(id: string): Promise<OrderDetail> {
    const detail = await this.orderDetailRepository.findOne({
      where: { id },
      relations: ['order', 'product'],
    });

    if (!detail) {
      throw new NotFoundException(`OrderDetail con id ${id} no encontrado`);
    }

    return detail;
  }

  // Actualizar un detalle
  async update(id: string, updateOrderDetailDto: UpdateOrderDetailDto): Promise<OrderDetail> {
    const existing = await this.findOne(id);
    const updated = Object.assign(existing, updateOrderDetailDto);
    return await this.orderDetailRepository.save(updated);
  }

  // Eliminar un detalle
  async remove(id: string): Promise<void> {
    const existing = await this.findOne(id);
    await this.orderDetailRepository.remove(existing);
  }
}
