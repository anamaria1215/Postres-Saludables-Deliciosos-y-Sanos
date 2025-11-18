import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Delivery } from "src/entities/delivery.entity";
import { Order } from "src/entities/order.entity";
import { Repository } from "typeorm";
import { OrderStatus } from "src/enum/order-status.enum";
import { UpdateStatusDeliveryDto } from "./DTOs/change-status-delivery.dto";
import { DeliveryStatus } from "src/enum/delivery-status.enum";


@Injectable()
export class DeliveryRepository {
    constructor(
        @InjectRepository(Delivery)
        private readonly deliveryRepository: Repository<Delivery>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>
    ) {}
    
    //Rutas del admin

    //Obtener todos los domicilios
    async getAllDeliveriesRepository() {
        console.log('Se envío la respuesta del getAllDeliveries.');
        return await this.deliveryRepository.find({
            order: { createdAt: 'DESC' },
            relations: [
                'order',
                'order.user',
            ]
        });
    }

    //Registrar un domicilio
    async postRegisterDeliveryRepository(data: {
        order_uuid: string;
        address: string;
        phoneNumber: string;
    }) {
        const newDelivery = this.deliveryRepository.create({
            order: { uuid: data.order_uuid },
            address: data.address,
            phoneNumber: data.phoneNumber,
        });

        await this.deliveryRepository.save(newDelivery);

        //Marcar la orden como EN_CAMINO
        await this.orderRepository.update(
            { uuid: data.order_uuid },
            { status: OrderStatus.EN_CAMINO },
        );

        console.log(
            `Domicilio con Id ${newDelivery.uuid} registrado correctamente. La orden fue marcada como EN CAMINO.`,
        );

        return {
            message: `Domicilio con Id ${newDelivery.uuid} registrado correctamente. La orden fue marcada como EN CAMINO.`,
        };
    }

    //Actualizar estado del domicilio
    async putUpdateDeliveryStatusRepository(
        deliveryExists: Delivery,
        updateStatusDeliveryDto: UpdateStatusDeliveryDto,
    ) {
        const newStatus = updateStatusDeliveryDto.status;

        deliveryExists.status = newStatus;
        await this.deliveryRepository.save(deliveryExists);

        const orderUuid = deliveryExists.order.uuid;

        // ENTREGADO → Orden COMPLETADA
        if (newStatus === DeliveryStatus.ENTREGADO) {
            await this.orderRepository.update(
                { uuid: orderUuid },
                { status: OrderStatus.COMPLETADA },
            );
        }

        // ENTREGA_FALLIDA → Orden con mismo estado
        if (newStatus === DeliveryStatus.ENTREGA_FALLIDA) {
            await this.orderRepository.update(
                { uuid: orderUuid },
                { status: OrderStatus.ENTREGA_FALLIDA },
            );
        }

        console.log(
            `Estado del domicilio con Id ${deliveryExists.uuid} modificado a ${deliveryExists.status} correctamente.`,
        );

        return {
            message: `Estado del domicilio con Id ${deliveryExists.uuid} modificado a ${deliveryExists.status} correctamente.`,
        };
    }


    //Rutas compartidas

    //Obtener un domicilio por Id
    async getDeliveryByIdRepository(uuid: string) {
        console.log('Se envío la respuesta del getDeliveryById.');
        return await this.deliveryRepository.findOne({
            where: { uuid : uuid },
            relations: [
                'order',
                'order.user',
            ]
        });
    }
}