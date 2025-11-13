import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './DTOs/create-payment.dto';
import { PaymentRepository } from './payment.repository';
import { OrderRepository } from 'src/order/order.repository';
import { UpdatePaymentDto } from './DTOs/update-payment.dto';
import { PaymentMethods } from 'src/enum/payment-methods.enum';
import { PaymentStatus } from 'src/enum/payment-status.enum';

@Injectable()
export class PaymentService {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly orderRepository: OrderRepository
    ) {}

    //Creación de rutas CRUD

    //Rutas de admin

    //Ruta para ver todos los pagos
    async getAllPaymentsService() {
        return this.paymentRepository.getAllPaymentsRepository();
    }
    
    //Ruta para registrar un pago
    async postRegisterPaymentService(
        createPaymentDto: CreatePaymentDto
    ) {
        const { order_uuid, method } = createPaymentDto;
        //Validar si la orden existe
        const orderExists = await this.orderRepository.findOne({
            where: { id: order_uuid },
            relations: ['orderDetails', 'user'],
        });
        if (!orderExists) throw new NotFoundException('La orden de compra no existe.');
        //Validar si ya existe un pago asociado en el sistema
        const paymentExist = await this.paymentRepository.getPaymentByOrderRepository(order_uuid);
        if (paymentExist) {
            throw new ConflictException('Ya existe un pago asociado a esta orden.');
        }
        //Tomar el total desde la orden
        const total = Number(orderExists.totalAmount);

        const payment = {
            method,
            total,
            order_uuid,
        };
        return this.paymentRepository.postRegisterPaymentRepository(payment);
    }

    //Ruta para ver un pago en específico por Id
    async getPaymentByIdService(uuid: string) {
        //Validar si el pago existe
        const paymentExist = await this.paymentRepository.getPaymentByIdRepository(uuid);
        if (!paymentExist) {
            throw new NotFoundException('Este pago no existe.')
        }
        return paymentExist;   
    }

    //Ruta para actualizar el estado de un pago
    async putUpdatePaymentService(
        uuid: string,
        updatePaymentDto: UpdatePaymentDto,
    ) {
        //Validar si el pago existe en el sistema
        const paymentExists = await this.paymentRepository.getPaymentByIdRepository(uuid);
        if (!paymentExists) {
            throw new NotFoundException('Este pago no existe.')
        }
        //Si se va a actualizar el estado, validar que no sea el mismo que ya tiene
        if (paymentExists.status === updatePaymentDto.status) {
            throw new ConflictException(
                `Este pago ya tiene el estado ${paymentExists.status}. No es necesario actualizarlo.`,
            )
        }
        //Si se va a actualizar el método, validar que no sea el mismo que ya tiene
        if (paymentExists.method === updatePaymentDto.method) {
            throw new ConflictException(
                `Este pago ya tiene el método ${paymentExists.method }. No es necesario actualizarlo.`
            );
        }
        return this.paymentRepository.putUpdatePaymentRepository(paymentExists, updatePaymentDto);
    }

    //Ruta para cambiar el estado de un pago a Fallido (soft delete)
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
}
