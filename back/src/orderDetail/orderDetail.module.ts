import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from '../entities/orderDetail.entity';
import { OrderDetailService } from './orderDetail.service';
import { OrderDetailController } from './orderDetail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail])],
  providers: [OrderDetailService],
  controllers: [OrderDetailController],
  exports: [TypeOrmModule],
})
export class OrderDetailModule {}
