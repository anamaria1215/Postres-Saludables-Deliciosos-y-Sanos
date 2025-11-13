import { PaymentMethods } from "src/enum/payment-methods.enum";
import { PaymentStatus } from "src/enum/payment-status.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Notification } from "./notification.entity";
import { PurchaseOrder } from "./purchase-order.entity";
import { Refund } from "./refund.entity";

@Entity({ name: 'payment' })
export class Payment {

    @PrimaryGeneratedColumn('uuid')
    payment_uuid: string;

    @Column({
        type: 'enum',
        enum: PaymentMethods,
        nullable: false,
    })
    paymentMethod: PaymentMethods;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    transactionRef: string | null; //Referencia de la transacion generada con la pasarela de pago

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        nullable: false,
        default: PaymentStatus.PENDIENTE,
    })
    statusPayment: PaymentStatus;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
    })
    totalPayment: number;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    paymentDate: Date | null; //Cuando pasa a estado confirmado

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

    //Lado inverso: relación con notification -> 1:N, un pago puede tener muchas notificaciones
    @OneToMany(() => Notification, (notification) => notification.payment)
    notifications: Notification[];

    //Aquí va la FK: relación con purchase_order -> 1:1, un pago pertenece solo a una orden de compra
    @OneToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.payment)
    @JoinColumn({ name: 'purchase_order_uuid' }) //Nombre de la columna en la base de datos
    purchaseOrder: PurchaseOrder;

    //Lado inverso: relación con refund -> 1:1, un pago solo tiene un rembolso
    @OneToOne(() => Refund, (refund) => refund.payment)
    refund: Refund;
}