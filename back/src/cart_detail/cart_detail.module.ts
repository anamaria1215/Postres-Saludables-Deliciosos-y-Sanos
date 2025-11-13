import { Module } from '@nestjs/common';
import { CartDetailController } from './cart_detail.controller';
import { CartDetailService } from './cart_detail.service';

@Module({
  controllers: [CartDetailController],
  providers: [CartDetailService]
})
export class CartDetailModule {}
