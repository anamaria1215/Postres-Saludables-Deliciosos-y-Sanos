import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './DTOs/create-payment.dto';
import { PaymentRepository } from './payment.repository';
import { OrderRepository } from 'src/order/order.repository';
import { UpdatePaymentDto } from './DTOs/update-payment.dto';
import { PaymentStatus } from 'src/enum/payment-status.enum';

@Injectable()
export class PaymentService {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly orderRepository: OrderRepository
    ) {}

    //Rutas de admin

    //Ver todos los pagos
    async getAllPaymentsService() {
        return this.paymentRepository.getAllPaymentsRepository();
    }

    //Confirmar un pago
    async putConfirmPaymentService(
        uuid: string,
    ) {
        //Validar si el pago existe
        const paymentExists = await this.paymentRepository.getPaymentByIdRepository(uuid);
        if (!paymentExists) {
            throw new NotFoundException('Este pago no existe.')
        }
        if (paymentExists.status === PaymentStatus.CONFIRMADO) {
            throw new ConflictException('Este pago ya fue confirmado.')
        }
        return await this.paymentRepository.putConfirmPaymentRepository(paymentExists);
    }

    //Actualizar estado de un pago manualmente (si necesario)
    async putUpdatePaymentStatusService(
        uuid: string,
        updatePaymentDto: UpdatePaymentDto,
    ) {
        //Validar si el pago existe en el sistema
        const paymentExists = await this.paymentRepository.getPaymentByIdRepository(uuid);
        if (!paymentExists) {
            throw new NotFoundException('Este pago no existe.')
        }
        //Validar que no sea el mismo estado que ya tiene
        if (paymentExists.status === updatePaymentDto.status) {
            throw new ConflictException(
                `Este pago ya tiene el estado ${paymentExists.status}. No es necesario actualizarlo.`,
            )
        }
        if (paymentExists.status === PaymentStatus.CONFIRMADO) {
            throw new ConflictException('No es posible cambiar el estado de un pago que ya se encuentra CONFIRMADO.');
        }
        return this.paymentRepository.putUpdatePaymentStatusRepository(paymentExists, updatePaymentDto);
    }

    //Cambiar el estado de un pago a Fallido (soft delete)
    async deletePaymentService(
        uuid: string,
    ) {
        //Validar que el pago exista
        const paymentExists = await this.paymentRepository.getPaymentByIdRepository(uuid);
        if (!paymentExists) {
            throw new NotFoundException('Este pago no existe.')
        }
        if (paymentExists.status === PaymentStatus.FALLIDO) {
            throw new ConflictException('Este pago ya fue marcado como FALLIDO. No se necesita volver a hacer esta operación.')
        }
        return await this.paymentRepository.deletePaymentRepository(paymentExists);
    }

    //Rutas del user

    //Ruta para registrar un pago
    async postRegisterPaymentService(
        req: any, 
        createPaymentDto: CreatePaymentDto
    ) {
        const { order_uuid, method } = createPaymentDto;
        const userUuid = req.user.user_uuid;
        //Validar si la orden existe
        const orderExists = await this.orderRepository.getOrderByIdRepository(order_uuid);
        if (!orderExists) throw new NotFoundException('La orden no existe.');
        //Validar que la orden le pertenece al usuario autenticado
        if (orderExists.user.uuid !== userUuid) {
            throw new BadRequestException('No puedes pagar una orden que no te pertenece.');
        }
        //Validar si ya existe un pago asociado en el sistema
        const paymentExist = await this.paymentRepository.getPaymentByOrderRepository(order_uuid);
        if (paymentExist) {
            throw new ConflictException('Ya existe un pago asociado a esta orden.');
        }
        //Tomar el total desde la orden
        const total = Number(orderExists.total);

        const payment = {
            method,
            total,
            order_uuid
        };
        return this.paymentRepository.postRegisterPaymentRepository(payment);
    }

    //Rutas compartidas

    //Ver un pago en específico por Id
    async getPaymentByIdService(uuid: string) {
        //Validar si el pago existe
        const paymentExist = await this.paymentRepository.getPaymentByIdRepository(uuid);
        if (!paymentExist) {
            throw new NotFoundException('Este pago no existe.')
        }
        return paymentExist;   
    }
}
