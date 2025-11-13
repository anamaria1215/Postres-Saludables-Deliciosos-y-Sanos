import { 
    Column, 
    Entity, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn 
  } from 'typeorm';
  import { Category } from './category.entity';
  import { User } from './user.entity';
  
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

    // Relación con usuario (vendedor o creador del producto)
    @ManyToOne(() => User, (user) => user.products)
    user: User;

  }
  