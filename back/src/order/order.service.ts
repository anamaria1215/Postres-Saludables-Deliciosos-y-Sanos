import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrderRepository } from './order.repository';
import { CartRepository } from 'src/cart/cart.repository';
import { OrderDetailRepository } from 'src/orderDetail/orderDetail.repository';

import { OrderDetail } from 'src/entities/orderDetail.entity';
import { UpdateOrderDto } from './DTOs/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly orderDetailRepository: OrderDetailRepository,
  ) {}

  //Rutas del admin

  //Ver todos los pedidos 
  async getAllOrdersService() {
    return await this.orderRepository.getAllOrdersRepository();
  } 

  //Actualizar el estado de una orden
  async putOrderStatusService(
    uuid: string, 
    updateOrderDto: UpdateOrderDto
  ) {
  //Validar si existe
  const orderExists = await this.orderRepository.getOrderByIdRepository(uuid);
  if (!orderExists) {
    throw new NotFoundException('Orden de pedido no encontrada.');
  }
  return this.orderRepository.putUpdateOrderStatusRepository(
    orderExists, updateOrderDto);
  }

  //Eliminar una orden (soft delete)
  async deleteOrderService(
    uuid: string
  ) {
  //Validar si existe
  const orderExists = await this.orderRepository.getOrderByIdRepository(uuid);
  if (!orderExists) {
    throw new NotFoundException('Orden de pedido no encontrada.');
  }
  return this.orderRepository.deleteOrderRepository(
    orderExists);
  }

  //Rutas del user

  //Crear una orden a partir del carrito activo
  async postCreateOrderService(
    req: any, 
  ) {
    const userUuid = req.user.user_uuid;
    //Obtener carrito activo
    const cart = await this.cartRepository.getCartByUserIdRepository(userUuid);
    if (!cart || cart.cartDetail.length === 0) {
      throw new BadRequestException('Carrito vacío, no se puede crear la orden.');
    }
    // Calcular subtotal (suma de todos los detalles de carrito)
    const subtotal = cart.cartDetail.reduce(
      (sum, d) => sum + d.unitPrice * d.quantity,
      0,
    );
    //Valores fijos para el total
    const discount = 0;
    const iva = subtotal * 0.19; // 19% de IVA
    const deliveryCosts = 4000;
    //Crear la orden
    const newOrder = new Order();
    newOrder.user = userUuid;
    newOrder.subtotal = Number(subtotal);
    newOrder.discount = Number(discount);
    newOrder.iva = Number(iva);
    newOrder.deliveryCosts = Number(deliveryCosts);
    newOrder.total = subtotal + deliveryCosts + iva - discount;
    
    const savedOrder = await this.orderRepository.postCreateOrderRepository(newOrder);
    if (!savedOrder) {
      throw new NotFoundException('Error interno: La orden no se guardó correctamente.');
    }
    //Crear los detalles de la orden
    const detailsToSave = cart.cartDetail.map((detail) => {
      const orderDetail = new OrderDetail();
      orderDetail.order = savedOrder;
      orderDetail.product = detail.product;
      orderDetail.quantity = Number(detail.quantity);
      orderDetail.unitPrice = Number(detail.unitPrice);
      orderDetail.subtotal = detail.quantity * detail.unitPrice;
      return orderDetail;
    });
    await this.orderDetailRepository.postCreateOrderDetailsRepository(detailsToSave);

    //Cambiar estado del carrito a COMPLETADO
    await this.cartRepository.completeCartRepository(cart);

    //Luego vaciarlo
    await this.cartRepository.deleteCartRepository(cart);
    
    return {
      message: `Orden de pedido con Id ${savedOrder.uuid} del usuario ${savedOrder.user.credential.username} creada correctamente.`,
      order: savedOrder,
    }
  }

  //Ver historial de pedidos
  async getOrdersHistoryService(
    req: any
  ) {
    const userUuid = req.user.user_uuid;
    return this.orderRepository.getOrdersHistoryRepository(userUuid);
  }

  //Cancelar un pedido (solo si su estado aún no es “En camino”). O sea no tiene domicilio registrado.
  //El usuario solo puede pasar a estado cancelado
  async putCancelOrderService(
    req: any, 
    uuid: string
  ) {
    const userUuid = req.user.user_uuid;
    //Validar que exista la orden
    const orderExists = await this.orderRepository.getOrderByIdRepository(uuid);
    if (!orderExists) throw new NotFoundException('Orden de pedido no encontrada.');
    // Solo puede cancelar su propia orden
    if (orderExists.user.uuid !== userUuid) {
      throw new BadRequestException('No puedes cancelar una orden que no te pertenece.');
    }
    // Solo se puede cancelar si no hay domicilio
    const status = orderExists.status.trim().toUpperCase(); //Para pasar la validacion aunque venga en minuscula

    if (status === 'CANCELADA') {
      throw new ConflictException('Esta orden ya está cancelada.')
    }
    if (status !== 'CREADA' && status !== 'PREPARANDO') {
      throw new BadRequestException('No se puede cancelar un pedido que ya tiene un sido enviado y/o completado.');
    }
    return this.orderRepository.putCancelOrderRepository(orderExists);
  }

  //Rutas compartidas

  //Obtener orden por Id 
  async getOrderByIdService(
    uuid: string,
    req: any
  ) {
    const userUuid = req.user.user_uuid;
    const userRole = req.user.role;
    //Validar si existe
    const orderExists = await this.orderRepository.getOrderByIdRepository(uuid);
    if (!orderExists) {
      throw new NotFoundException('Orden de pedido no encontrada.');
    }
    // Validar propiedad: Admin puede ver todo, User solo la suya
    const orderOwner = orderExists.user.uuid;

    const isOwner = orderOwner === userUuid;
    const isAdmin = userRole === 'Admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para ver esta orden.'
      );
    }
    return orderExists;
  }  
}
