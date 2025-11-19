import { 
  Column, 
  Entity, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  JoinColumn
} from 'typeorm';
import { Category } from './category.entity';
import { OrderDetail } from './orderDetail.entity';
import { CartDetail } from './cartDetail.entity';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  // Indica si el producto está activo o eliminado (soft delete)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Fecha automática de creación
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Fecha automática de última actualización
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación con categorías
  @ManyToOne(() => Category, (category) => category.product)
  category: Category;

  //Relacion con cartDetail (muchos detalles pueden tener un producto asociado)
  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.product)
  @JoinColumn({ name: 'cart_detail_uuid' })
  cartDetail: CartDetail[];

  // Relación con OrderDetail
  @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
  orderDetails: OrderDetail[];
}
  