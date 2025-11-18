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
  quantity: number; //Cantidad de unidades del producto en el detalle del carrito

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  unitPrice: number; //Precio unitario del producto al momento de agregar al carrito

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  subtotal: number; //Subtotal = quantity * unitPrice

  //Relación con carrito (muchos detalles pueden pertenecer a un carrito)
  @ManyToOne(() => Cart, (cart) => cart.cartDetail)
  @JoinColumn({ name: 'cart_uuid' })
  cart: Cart;

  //Relacion con producto (muchos detalles pueden tener un producto asociado)
  @ManyToOne(() => Product, (product) => product.cartDetail)
  @JoinColumn({ name: 'product_uuid' })
  product: Product;
}