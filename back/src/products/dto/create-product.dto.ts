import { IsString, IsNumber, IsUUID, Min, IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsUUID()
  @IsNotEmpty({ message: 'La categoría es obligatoria y debe ser un UUID válido' })
  categoryUuid: string;
}
