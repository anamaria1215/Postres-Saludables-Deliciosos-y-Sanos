import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/entities/order.entity";
import { Repository } from "typeorm";

import { OrderStatus } from "src/enum/order-status.enum";
import { UpdateOrderDto } from "./DTOs/update-order.dto";

@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {}

    //Método para restar stock del producto cuando se confirma un pago
    async putOrderPreparingRepository(order: Order) {
        return await this.orderRepository.manager.transaction(
            async (transactionManager) => {
                //Obtener la orden con todos sus detalles
                const orderWithDetails = await transactionManager.findOne(Order, {
                    where: { uuid: order.uuid },
                    relations: ['orderDetails', 'orderDetails.product']
                });
                if (!orderWithDetails) {
                    throw new NotFoundException('Orden no encontrada.');
                }
                //Restar stock por cada detalle
                for (const detail of orderWithDetails.orderDetails) {
                    const product = detail.product;
                    if (product.stock < detail.quantity) {
                        throw new BadRequestException(
                            `Stock insuficiente para el producto ${product.name}.`
                        );
                    }
                    product.stock -= detail.quantity;
                    await transactionManager.save(product);
                }
                //Cambiar estado de la orden
                orderWithDetails.status = OrderStatus.PREPARANDO;
                await transactionManager.save(orderWithDetails);
                return {
                    message: `Orden con Id ${order.uuid} actualizada a PREPARANDO y stock descontado correctamente.`
                }
            }
        );
    }

    //Rutas del admin

    //Ver todos los pedidos
    getAllOrdersRepository() {
        console.log('Se envió la respuesta del getAllOrders.');
        return this.orderRepository.find({
            order: { createdAt: 'DESC' },
            relations: [
                'orderDetails',
                'payment',
                'delivery',
                'user',
            ]
        });
    }
    
    //Ruta para cambiar manualmente el estado de un pedido
    async putUpdateOrderStatusRepository(
        orderExists: Order,
        updateOrderDto: UpdateOrderDto
    ) {
        orderExists.status = updateOrderDto.status;
        console.log(
            `Orden de pedido con Id ${orderExists.uuid} actualizada al estado ${orderExists.status} correctamente.`
        );
        await this.orderRepository.save(orderExists);
        return {
            message: `Orden de pedido con Id ${orderExists.uuid} actualizada al estado ${orderExists.status} correctamente.`
        }
    }

    //Eliminar una orden (soft delete)
    async deleteOrderRepository(orderExists: Order) {
        orderExists.status = OrderStatus.ELIMINADA;
        console.log(
            `Orden de pedido con Id ${orderExists.uuid} eliminada (soft delete) correctamente.`
        );
        await this.orderRepository.save(orderExists);
        return {
            message: `Orden de pedido con Id ${orderExists.uuid} eliminada (soft delete) correctamente.`
        }   
    }

    //Rutas del user

    //Crear una orden a partir del carrito activo    
    async postCreateOrderRepository(newOrder: Order) {
        const savedOrder = await this.orderRepository.save(newOrder);
        const order = await this.orderRepository.findOne({
            where: { uuid: savedOrder.uuid },
            relations: {
                user: {
                    credential: true
                },
            },
        });
        console.log(
            `Orden de pedido con Id ${savedOrder.uuid} del usuario creada correctamente.`,
        );
        return order;
    }

    //Ver historial de pedidos
    async getOrdersHistoryRepository(
        userUuid: string
    ) {
        console.log('Se envió la respuesta del getOrdersHistory.');
        return this.orderRepository.find({
            order: { createdAt: 'DESC' },
            where: { user: { uuid: userUuid } },
            relations: [
                'orderDetails',
                'payment',
                'delivery',
                'user',
            ]
        });
    }

    //Cancelar un pedido (solo si su estado aún no es “Enviado”).
    async putCancelOrderRepository(orderExists: Order) {
        orderExists.status = OrderStatus.CANCELADA
        console.log(
            `Orden con Id ${orderExists.uuid} cancelada correctamente.`,
        );
        await this.orderRepository.save(orderExists);
        return {
            message: `Orden con Id ${orderExists.uuid} cancelada correctamente.`,
        }
    }

    //Obtener orden por Id 
    async getOrderByIdRepository(uuid: string) {
        console.log('Se envió la respuesta del getOrderById.');
        return this.orderRepository.findOne({
            where: { uuid : uuid },
            relations: [
                'orderDetails',
                'payment',
                'delivery',
                'user',
            ]
        });
    }
}    