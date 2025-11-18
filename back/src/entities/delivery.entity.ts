import { DeliveryStatus } from "src/enum/delivery-status.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({ name: 'delivery' })
export class Delivery {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({
        type: 'timestamp',  
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    deliveryDate: Date; //La fecha en que se realiza un domicilio, se genera automaticamente cuando se crea

    @Column({
        type: 'enum',
        enum: DeliveryStatus,
        default: DeliveryStatus.ENVIADO,
    })
    status: DeliveryStatus;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    address: string; //Se toma del usuario

    @Column({
        type: 'varchar',
        length: 15,
        nullable: false,
    })
    phoneNumber: string; //Se toma del usuario

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

    //Aquí va la FK: relación con order -> 1:1, un domicilio pertenece a una orden de compra
    @OneToOne(() => Order, (order) => order.delivery)
    @JoinColumn({ name: 'order_uuid' })
    order: Order;
}   