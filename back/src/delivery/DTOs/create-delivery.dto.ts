import { ApiProperty } from '@nestjs/swagger';
import { 
    IsNotEmpty, 
    IsUUID,
} from 'class-validator';

export class CreateDeliveryDto {
  @ApiProperty({
    description: 'UUID de la orden a la cual se va a generar el domicilio.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c4',
  })
  @IsNotEmpty({
    message: 'El Id de la order de la que se va a registrar el domicilio es obligatorio.',
  })
  @IsUUID(4, {
    message: 'El Id de la order de la que se va a registrar el domicilio debe ser un formato UUID válido.'
  })
  order_uuid: string;
}
