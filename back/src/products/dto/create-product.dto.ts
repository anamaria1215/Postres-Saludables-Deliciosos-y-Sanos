import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, Min, IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto.',
    example: 'Brownie saludable',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripcion del producto.',
    example: 'Brownie saludable hecho con ingredientes naturales.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Precio del producto.',
    example: '6000.00',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Stock inicial del producto en el inventario.',
    example: '30',
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'UUID de la categoria donde se creará el producto.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c4',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'La categoría es obligatoria y debe ser un UUID válido' })
  categoryUuid: string;
}
