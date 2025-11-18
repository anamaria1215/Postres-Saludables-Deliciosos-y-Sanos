import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryRepository } from './delivery.repository';
import { CreateDeliveryDto } from './DTOs/create-delivery.dto';
import { UpdateStatusDeliveryDto } from './DTOs/change-status-delivery.dto';
import { OrderRepository } from 'src/order/order.repository';
import { RolesEnum } from 'src/enum/roles.enum';
import { PaymentStatus } from 'src/enum/payment-status.enum';

@Injectable()
export class DeliveryService {
    constructor(
        private readonly deliveryRepository: DeliveryRepository,
        private readonly orderRepository: OrderRepository,

    ) {}

    //Rutas del admin

    //Obtener todos los domicilios
    async getAllDeliveriesService() {
        return await this.deliveryRepository.getAllDeliveriesRepository();
    }    

    //Registar un domicilio
    async postRegisterDeliveryService(createDeliveryDto: CreateDeliveryDto) {
        const { order_uuid } = createDeliveryDto;
        const order = await this.orderRepository.getOrderByIdRepository(order_uuid);
        if (!order) {
            throw new NotFoundException('La orden no existe.');
        }

         if (!order.user) {
            throw new BadRequestException('La orden no tiene usuario asociado.');
        }

            //Validar que exista un pago asociado y que esté confirmado

        if (!order.payment) {
        throw new BadRequestException(
            'No se puede crear domicilio: la orden no tiene pago asociado.'
        );
        }
        if (order.payment.status !== PaymentStatus.CONFIRMADO) {
            throw new BadRequestException(
                'No se puede crear domicilio: el pago de la orden no está confirmado.'
            );
        }

        //Evitar crear un domicilio si la orden ya tiene uno
        if (order.delivery) {
            throw new BadRequestException('La orden ya tiene un domicilio registrado.');
        }

        //Extraer los datos del usuario (address y phoneNumber)
        const { address, phoneNumber } = order.user;
        if (!address) {
            throw new BadRequestException('El usuario no tiene dirección registrada.');
        }

        return await this.deliveryRepository.postRegisterDeliveryRepository({
            order_uuid,
            address,
            phoneNumber,
        });
    }

    //Actualizar el estado de un domicilio
    async putUpdateDeliveryStatusService(
        uuid: string, 
        updateStatusDeliveryDto: UpdateStatusDeliveryDto
    ) {
        //Validar si el envio existe
        const deliveryExists = await this.deliveryRepository.getDeliveryByIdRepository(uuid);
        if (!deliveryExists) throw new NotFoundException('Domicilio no encontrado.');
        return await this.deliveryRepository.putUpdateDeliveryStatusRepository(
            deliveryExists,
            updateStatusDeliveryDto
        );
    }

    //Rutas compartidas

    //Obtener un domicilio por Id
    async getDeliveryByIdService(uuid: string, req: any) {
        const userUuid = req.user.user_uuid;
        const userRole = req.user.role;

        const delivery = await this.deliveryRepository.getDeliveryByIdRepository(uuid);
        if (!delivery) {
            throw new NotFoundException('Domicilio no encontrado.');
        }

        if (userRole === RolesEnum.USER) {
            const ownerUuid = delivery.order.user.uuid;

            if (ownerUuid !== userUuid) {
                throw new ForbiddenException(
                    'No tienes permiso para ver este domicilio.',
                );
            }
        }   
        return delivery;
    }

}


