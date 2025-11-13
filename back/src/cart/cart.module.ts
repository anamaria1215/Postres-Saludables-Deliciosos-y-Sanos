import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { Cart } from 'entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart])],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartRepository],
})
export class CartModule {}
