
import { Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany, 
    JoinColumn, 
    OneToOne, 
    ManyToOne} from 'typeorm';
//import { Credential } from './credential.entity';
//import { Order } from './order.entity';
import { Product } from './product.entity';


@Entity({ name: 'User' })
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
        type: 'bigint',
        unique: true
    })
    phoneNumber: number;

    @Column ({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    address:string


    @Column ({
        type: Date
    })
    birthDay: Date

    @Column ({
        type: 'timestamp',  
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;


//@OneToOne(() => Credential, (credential) => credential.user, { cascade: true })
@JoinColumn()
credential: Credential;

//@OneToMany(() => Order, (order: Order) => order.user)
//order: Order[];

@OneToMany(() => Product, (product) => product.user)
  product: Product[];

@ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_uuid' })
  carts: User[];
}