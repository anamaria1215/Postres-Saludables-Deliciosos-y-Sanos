import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, OneToOne, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity'; 
import { OrderDetail } from './orderDetail.entity';
import { Payment } from './payment.entity';
import { OrderStatus } from 'src/enum/order-status.enum';
import { Delivery } from './delivery.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  subtotal: number; //Suma de los subtotales de los detalles del carrito

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.00,
  })
  discount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  iva: number; //19% 

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 4000.00,
  })
  deliveryCosts: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    nullable: false,
  })
  total: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderDate: Date;  

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREADA,
  })
  status: string;

  @CreateDateColumn({
    type: 'timestamp',  
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',  
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;    

  //Relacion con usuario
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  //Relacion con detalles
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, { cascade: true })
  orderDetails: OrderDetail[];

  //Relacion con pago
  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  //Relacion con domicilio
  @OneToOne(() => Delivery, (delivery) => delivery.order)
  delivery: Delivery;
}
