import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
  exports: [TypeOrmModule, OrderRepository],
})
export class OrderModule {}
