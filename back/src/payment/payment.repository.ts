import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "src/entities/payment.entity";
import { PaymentMethods } from "src/enum/payment-methods.enum";
import { Repository } from "typeorm";
import { UpdatePaymentDto } from "./DTOs/update-payment.dto";
import { PaymentStatus } from "src/enum/payment-status.enum";

@Injectable()
export class PaymentRepository {
    constructor(
            @InjectRepository(Payment)
            private readonly paymentDBRepo: Repository<Payment>,
        ) {}

    //Método para buscar un pago por order de pedido
    async getPaymentByOrderRepository(order_uuid: string) {
        return await this.paymentDBRepo.findOne({
            where: { order: { id: order_uuid } },
            relations: [
                'order',
                'order.user',
                'order.user.credential',
            ],
        });
    }
  
    // //Creación de rutas CRUD

    //Rutas de admin

    //Ruta para ver todos los pagos
    async getAllPaymentsRepository() {
        console.log('Se envío la respuesta del getAllPayments.');
        return await this.paymentDBRepo.find({
            order: { createdAt: 'DESC' },
            relations: [
                'order',
                'order.user',
                'order.user.credential',
            ],
        });
    }
    
    //Ruta para registrar un pago
    async postRegisterPaymentRepository(payment: {
        method: PaymentMethods;
        total: number;
        order_uuid: string;
    }) {
        
        const { method, total, order_uuid } = payment;

        const newPayment = this.paymentDBRepo.create({
            method,
            total,
            order: { id: order_uuid },
        });
        await this.paymentDBRepo.save(newPayment);
        console.log(`Pago de la orden con Id ${newPayment.order.id} registrado correctamente.`);
        return {
            message: `Pago de la orden con Id ${newPayment.order.id} registrado correctamente.`,
            status_payment: newPayment.status,
        };
    }

    //Ruta para ver un pago en específico por Id
    async getPaymentByIdRepository(uuid: string) {
        console.log('Se envió la respuesta del getPaymentById.');
        return await this.paymentDBRepo.findOne({
            where: { uuid : uuid },
            relations: [
                'order',
                'order.user',
                'order.user.credential',
            ],
        });
    }
      
    //Ruta para actualizar el estado de un pago manualmente
    async putUpdatePaymentRepository(
        paymentExists: Payment,
        updatePaymentDto: UpdatePaymentDto
    ) {
        if (updatePaymentDto.status) { 
            paymentExists.status = updatePaymentDto.status;
        }

        if (updatePaymentDto.method) {
            paymentExists.method = updatePaymentDto.method;
        }
        await this.paymentDBRepo.save(paymentExists);
        console.log(
            `Pago con Id ${paymentExists.uuid} actualizado correctamente.`);
        return {
            message: `Pago con Id ${paymentExists.uuid} actualizado correctamente.'`,
            status_payment: paymentExists.status,
            method_payment: paymentExists.method
        };
    }

    //Ruta para cambiar el estado de un pago a Fallido
    async deletePaymentRepository(
        paymentExists: Payment,
    ) {
        paymentExists.status = PaymentStatus.FALLIDO;
        await this.paymentDBRepo.save(paymentExists);
        console.log(`Pago con Id ${paymentExists.uuid} marcaso como pago ${paymentExists.status} correctamente.`);
        return {
            message: `Pago con Id ${paymentExists.uuid} marcaso como pago ${paymentExists.status} correctamente.`,
            status_payment: paymentExists.status
        }
    }
}