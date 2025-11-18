import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from '../entities/orderDetail.entity';
import { OrderDetailService } from './orderDetail.service';
import { OrderDetailController } from './orderDetail.controller';
import { Order } from 'src/entities/order.entity';
import { OrderModule } from 'src/order/order.module';
import { OrderDetailRepository } from './orderDetail.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDetail, Order]),
    forwardRef(() => OrderModule),
  ],
  controllers: [OrderDetailController],
  providers: [OrderDetailService, OrderDetailRepository],
  exports: [OrderDetailRepository],
})
export class OrderDetailModule {}
