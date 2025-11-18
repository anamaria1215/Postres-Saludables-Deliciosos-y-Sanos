import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { OrderModule } from 'src/order/order.module';
import { Order } from 'src/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order]), OrderModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository]
})
export class PaymentModule {}
