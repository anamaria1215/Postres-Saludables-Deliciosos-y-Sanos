import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { PaymentMethods } from "src/enum/payment-methods.enum";

export class CreatePaymentDto {

    @ApiProperty({ enum: PaymentMethods, description: 'Es el método de pago válido.', example: PaymentMethods.NEQUI })
    @IsEnum(PaymentMethods, { 
        message: 'El método de pago debe encontrarse entre las opciones válidas: Efectivo, Tarjeta, PSE, Nequi, Daviplata',
    })
    @IsNotEmpty({ 
        message: 'El método de pago es obligatorio.', 
    })
    method: PaymentMethods;

    @ApiProperty({ description: 'UUID de la orden asociada al pago.', example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8' })
    @IsUUID('4', { 
        message: 'El Id de la orden debe ser un UUID válido.',
    })
    @IsNotEmpty({ 
        message: 'El Id de la orden es obligatorio.',
    })
    order_uuid: string; 
}