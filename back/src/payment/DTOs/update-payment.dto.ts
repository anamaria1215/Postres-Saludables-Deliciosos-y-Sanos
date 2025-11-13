import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaymentMethods } from 'src/enum/payment-methods.enum';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
    @ApiPropertyOptional({
        enum: PaymentStatus,
        description: 'Estado del pago a actualizar.',
        example: PaymentStatus.FALLIDO,
        required: false
    })
    @IsOptional({
    })
    @IsEnum(PaymentStatus, {
        message: 'El estado del pago debe estar dentro de las opciones válidas: Pendiente, Confirmado, Fallido.',
    })
    status?: PaymentStatus;

    @ApiPropertyOptional({ 
        enum: PaymentMethods, 
        description: 'Método del pago a actualizar.',
        example: PaymentMethods.TARJETA,
        required: false 
    })
    @IsOptional()
    @IsEnum(PaymentMethods, {
        message: 'El método de pago debe estar dentro de las opciones válidas: Efectivo, Tarjeta, PSE, Nequi o Daviplata.'
    })
    method?: PaymentMethods;
}
