import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/entities/order.entity";
import { OrderDetail } from "src/entities/orderDetail.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrderDetailRepository {
    constructor(
        @InjectRepository(OrderDetail)
        private readonly orderDetailRepository: Repository<OrderDetail>
    ) {}

    //Método para crear detalles de orden a partir de la creacion de la orden
    async postCreateOrderDetailsRepository(detailsToSave: OrderDetail[]) {
        console.log('Se envió la respuesta del postCreateOrderDetails.');
        return await this.orderDetailRepository.save(detailsToSave);
    }

    //Rutas del admin

    //Ver todos los detalles que componen una orden por su UUID (lectura)
    async getOrderDetailsAdminRepository(orderExists) {
        console.log('Se envió la respuesta del getOrderDetailsAdmin.');
        return this.orderDetailRepository.find({
            where: { order: { uuid : orderExists.uuid } },
            relations: [
                'product',
                'order'
            ]
        });
    }

    //Rutas del user

    //Ver todos los detalles que componen una orden por su UUID (lectura)
    async getOrderDetailsUserRepository(orderExists: Order, userUuid: string) {
        console.log('Se envió la respuesta del getOrderDetailsUser.');
        return this.orderDetailRepository.find({
            where: {
                order: {
                    uuid: orderExists.uuid,
                    user: { uuid: userUuid }
                }
            },
            relations: [
                'product',
                'order'
            ]
        });
    }
}
