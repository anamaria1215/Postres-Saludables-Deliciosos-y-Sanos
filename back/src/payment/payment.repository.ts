import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "src/entities/payment.entity";
import { PaymentMethods } from "src/enum/payment-methods.enum";
import { Repository } from "typeorm";
import { UpdatePaymentDto } from "./DTOs/update-payment.dto";
import { PaymentStatus } from "src/enum/payment-status.enum";
import { OrderRepository } from "src/order/order.repository";

@Injectable()
export class PaymentRepository {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly orderRepository: OrderRepository,
    ) {}

    //Método para buscar un pago por order de pedido
    async getPaymentByOrderRepository(order_uuid: string) {
        return await this.paymentRepository.findOne({
            where: { order: { uuid: order_uuid } },
            relations: [
                'order',
                'order.user',
                'order.user.credential',
            ],
        });
    }
  
    //Rutas de admin

    //Ver todos los pagos
    async getAllPaymentsRepository() {
        console.log('Se envío la respuesta del getAllPayments.');
        return await this.paymentRepository.find({
            order: { createdAt: 'DESC' },
            relations: [
                'order',
                'order.user',
                'order.user.credential',
            ],
        });
    }

    //Confirmar un pago
    async putConfirmPaymentRepository(paymentExists: Payment) {
        paymentExists.status = PaymentStatus.CONFIRMADO;
        //Cambiar estado de la orden + restar stock
        const order = paymentExists.order;
        await this.orderRepository.putOrderPreparingRepository(order);
        await this.paymentRepository.save(paymentExists);
        console.log(`Pago con Id ${paymentExists.uuid} CONFIRMADO correctamente.`);
        return {
            message: `Pago con Id ${paymentExists.uuid} CONFIRMADO correctamente.`,
            method: paymentExists.method,
            order: paymentExists.order,
            user: paymentExists.order.user
        }
    }

    //Ruta para actualizar el estado de un pago manualmente
    async putUpdatePaymentStatusRepository(
        paymentExists: Payment,
        updatePaymentDto: UpdatePaymentDto
    ) {
        if (updatePaymentDto.status) { 
            paymentExists.status = updatePaymentDto.status;
        }
        await this.paymentRepository.save(paymentExists);
        console.log(
            `Pago con Id ${paymentExists.uuid} actualizado correctamente.`);
        return {
            message: `Pago con Id ${paymentExists.uuid} actualizado correctamente.'`,
            status: paymentExists.status,
            method: paymentExists.method,
            order: paymentExists.order,
            user: paymentExists.order.user
        };
    }

    //Cambiar el estado de un pago a Fallido (soft delete)
    async deletePaymentRepository(
        paymentExists: Payment,
    ) {
        paymentExists.status = PaymentStatus.FALLIDO;
        await this.paymentRepository.save(paymentExists);
        console.log(`Pago con Id ${paymentExists.uuid} marcado como pago ${paymentExists.status} correctamente.`);
        return {
            message: `Pago con Id ${paymentExists.uuid} marcado como pago ${paymentExists.status} correctamente.`,
            method: paymentExists.method,
            order: paymentExists.order,
            user: paymentExists.order.user
        }
    }

     //Rutas del user

    //Ruta para registrar un pago
    async postRegisterPaymentRepository(
        payment: {
            method: PaymentMethods;
            total: number;
            order_uuid: string;
    }) {
        const { method, total, order_uuid } = payment;

        const newPayment = this.paymentRepository.create({
            method,
            total,
            order: { uuid: order_uuid },
        });
        await this.paymentRepository.save(newPayment);
        console.log(`Pago de la orden con Id ${newPayment.order.uuid} registrado correctamente.`);
        return {
            message: `Pago de la orden con Id ${newPayment.order.uuid} registrado correctamente`,
            status: newPayment.status,
            method: newPayment.method,
            order: newPayment.order,
            user: newPayment.order.user
        };
    }

    //Ruta para ver un pago en específico por Id
    async getPaymentByIdRepository(uuid: string) {
        console.log('Se envió la respuesta del getPaymentById.');
        return await this.paymentRepository.findOne({
            where: { uuid : uuid },
            relations: [
                'order',
                'order.user',
                'order.user.credential',
            ],
        });
    }
}