import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { DeliveryStatus } from "src/enum/delivery-status.enum";

export class UpdateStatusDeliveryDto {
    @ApiProperty({
        enum: DeliveryStatus,
        description: 'Estado del domicilio a actualizar.',
        example: DeliveryStatus.EN_CAMINO,
        required: true
    })
    @IsNotEmpty({
        message: 'El estado del domicilio es requerido.'
    })
    @IsEnum(DeliveryStatus, {
        message: 'El estado del domicilio solo puede modificarse dentro de las opciones válidas: Enviado, En camino, Entregado, Entrega Fallida.'
    })
    status: DeliveryStatus;
}
