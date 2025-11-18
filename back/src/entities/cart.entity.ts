import {
  Column,
  Entity,
  JoinColumn,

  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
//import { User } from './users.entity';
import { Product } from './product.entity';
import { join } from 'path';
import { CartDetail } from './cart_detail.entity';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  addressDelivery: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deliveryDate: Date;

   @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
    })
    total: number;

  //Relación con usuario (Un Usuario puede tener un carrito activo)
  //@OneToOne(() => User, (user) => user.cart)
 // @JoinColumn({ name: 'user_id' })
  //user: User;

  // Relación con Detalle de Carrito (Un carrito puede tener muchos detalles)
  @OneToMany(() => CartDetail, (cart_detail) => cart_detail.cart)
  @JoinColumn({ name: 'cart_detail_id' })
  cart_detail: CartDetail[];
}