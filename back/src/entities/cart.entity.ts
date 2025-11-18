
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CartStatus } from 'src/enum/cart-status.enum';
import { CartDetail } from './cartDetail.entity';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  subtotal: number; //Suma de los subtotales de los detalles del carrito

  @Column({
    type: 'enum',
    enum: CartStatus,
    nullable: false,
    default: CartStatus.ACTIVO, //Cuando se crea un carrito, su estado es 'Activo'
  })
  status: CartStatus;

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

 //Relación con usuario (muchos carritos pueden pertenecer a un usuario)
  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  //Lado inverso: relación con cart_detail -> 1:N, un carrito tiene muchos detalles de carrito
  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.cart)  
  cartDetail: CartDetail[];  
}
