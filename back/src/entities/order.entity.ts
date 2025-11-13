import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, OneToOne } from 'typeorm';
import { User } from './user.entity'; // Cuando se cree User entity se soluciona esta importación
import { OrderDetail } from './orderDetail.entity';
import { Payment } from './payment.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.order)
  user: User;

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.order, { cascade: true })
  orderDetails: OrderDetail[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ length: 20 })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;
}
