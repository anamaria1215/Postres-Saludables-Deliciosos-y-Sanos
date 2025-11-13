import { PaymentMethods } from "src/enum/payment-methods.enum";
import { PaymentStatus } from "src/enum/payment-status.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({ name: 'payment' })
export class Payment {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
    })
    total: number;

    @Column({
        type: 'enum',
        enum: PaymentMethods,
        nullable: false,
    })
    method: PaymentMethods;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        nullable: false,
        default: PaymentStatus.CONFIRMADO, //Admin registra pagos confirmados
    })
    status: PaymentStatus;

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

    //Aquí va la FK: relación con order -> 1:1, un pago pertenece solo a una orden de compra
    @OneToOne(() => Order, (order) => order.payment)
    @JoinColumn({ name: 'order_uuid' }) //Nombre de la columna en la base de datos
    order: Order;
}