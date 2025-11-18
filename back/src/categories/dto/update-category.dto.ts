import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Nombre de la categoria.',
    example: 'Brownies',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Descripción de la categoria.',
    example: 'Brownies sin azúcar añadida, hechos con ingredientes saludables.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
