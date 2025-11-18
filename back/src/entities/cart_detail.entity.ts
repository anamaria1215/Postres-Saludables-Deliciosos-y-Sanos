import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity({ name: 'cart_detail' })
export class CartDetail {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  unitPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  subTotal: number;

  //  Relación con carrito (muchos detalles pueden pertenecer a un carrito)
  @ManyToOne(() => Cart, (cart) => cart.uuid)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
  // Relacion con producto (muchos detalles pueden tener un producto asociado)
  @ManyToOne(() => Product, (product) => product.uuid)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}