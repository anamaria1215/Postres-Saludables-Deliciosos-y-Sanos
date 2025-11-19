import { Module } from '@nestjs/common';
import { CartDetailService } from './cartDetail.service';
import { CartDetailRepository } from './cartDetail.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartDetail } from 'src/entities/cartDetail.entity';
import { CartModule } from 'src/cart/cart.module';
import { ProductsModule } from 'src/products/products.module';
import { CartDetailController } from './cartDetail.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartDetail]),
    CartModule, 
    ProductsModule,      
  ],
  controllers: [CartDetailController],
  providers: [CartDetailService, CartDetailRepository],
  exports: [CartDetailRepository],
})
export class CartDetailModule {}
