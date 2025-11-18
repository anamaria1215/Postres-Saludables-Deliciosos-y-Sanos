import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentDto {
    @ApiProperty({
        enum: PaymentStatus,
        description: 'Estado del pago a actualizar.',
        example: PaymentStatus.FALLIDO,
        required: false
    })
    @IsNotEmpty({
        message: 'Debe seleccionar un estado de pago válido.'
    })
    @IsEnum(PaymentStatus, {
        message: 'El estado del pago debe estar dentro de las opciones válidas: Pendiente, Confirmado, Fallido.',
    })
    status?: PaymentStatus;
}
