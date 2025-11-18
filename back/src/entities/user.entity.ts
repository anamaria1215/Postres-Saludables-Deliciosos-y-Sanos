
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany, 
    JoinColumn, 
    OneToOne,
    UpdateDateColumn,
    CreateDateColumn
} from 'typeorm';
import { Credential } from './credential.entity';
import { Order } from './order.entity';
import { Cart } from './cart.entity';

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    name: string;

    @Column ({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    lastName:string
   
    @Column ({
        type: 'varchar',
        length: 100,
        unique: true
    })
    email: string;
  
    @Column({
        type: 'varchar',
        length: 15,
        nullable: false,
    })
    phoneNumber: string;

    @Column ({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    address:string

    @Column({
        type: 'boolean',  
        default: true,
    })
    isActive: boolean;

    @CreateDateColumn ({
        type: 'timestamp',  
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',  
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @OneToOne(() => Credential, (credential) => credential.user)
    @JoinColumn({ name: 'credential_uuid' })
    credential: Credential;

    @OneToMany(() => Cart, (cart) => cart.user)
    carts: Cart[];

    @OneToMany(() => Order, (order: Order) => order.user)
    orders: Order[];
}