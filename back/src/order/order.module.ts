import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { UserModule } from 'src/user/user.module';
import { CartModule } from 'src/cart/cart.module';
import { CartDetailModule } from 'src/cartDetail/cartDetail.module';
import { OrderDetailModule } from 'src/orderDetail/orderDetail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UserModule,
    CartModule,
    CartDetailModule,
    forwardRef(() => OrderDetailModule),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository],
})
export class OrderModule {}
