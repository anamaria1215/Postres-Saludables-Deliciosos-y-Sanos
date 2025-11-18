import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderDetailRepository } from './orderDetail.repository';
import { OrderRepository } from 'src/order/order.repository';


@Injectable()
export class OrderDetailService {
  constructor(
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly orderRepository: OrderRepository
  ) {}

  //Rutas del admin

  //Ver todos los detalles que componen una orden por su UUID (lectura)
  async getOrderDetailsAdminService(uuid: string) {
    //Validar si existe
    const orderExists = await this.orderRepository.getOrderByIdRepository(uuid);
    if (!orderExists) throw new NotFoundException('Orden no encontrada.');
    return this.orderDetailRepository.getOrderDetailsAdminRepository(orderExists);
  }

  //Rutas del user  

  //Ver todos los detalles que componen una orden por su UUID (lectura)
  async getOrderDetailsUserService(
    req: any, 
    uuid: string) {
    const userUuid = req.user.user_uuid;
    //Validar si existe la orden
    const orderExists = await this.orderRepository.getOrderByIdRepository(uuid);
    if (!orderExists) throw new NotFoundException('Orden no encontrada.');
    if (orderExists.user.uuid !== userUuid) {
      throw new ForbiddenException('No tienes acceso a esta orden.');
    }
    return this.orderDetailRepository.getOrderDetailsUserRepository(orderExists, userUuid);
  }
}