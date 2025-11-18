import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la nueva categoria.',
    example: 'Brownies',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  name: string;

  @ApiPropertyOptional({
    description: 'Una breve descripción para la categoria (opcional).',
    example: 'Brownies sin azúcar añadida, hechos con ingredientes saludables.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
