import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number; //Cantidad de un producto en la orden

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  unitPrice: number; //Precio unitario del producto al momento de la compra

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  subtotal: number; //Subtotal = quantity * unitPrice

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_uuid' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  @JoinColumn({ name: 'product_uuid' })
  product: Product;
}
