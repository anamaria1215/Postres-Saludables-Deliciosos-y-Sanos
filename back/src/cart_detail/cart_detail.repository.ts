import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDetailDto } from './dto/create-cartdetail.dto';
import { CartDetail } from  '../entities/cart_detail.entity';

@Injectable()
export class CartDetailRepository {
  constructor(
    @InjectRepository(CartDetail)
    private readonly repository: Repository<CartDetail>,
  ) {}

  /**
   * Obtener todos los detalles con sus relaciones
   */
  findAll(): Promise<CartDetail[]> {
    return this.repository.find({ relations: ['cart', 'product'] });
  }

  /**
   * Buscar un detalle por UUID
   */
  findOne(uuid: string): Promise<CartDetail | null> {
    return this.repository.findOne({
      where: { uuid },
      relations: ['cart', 'product'],
    });
  }

  /**
   * Crear un nuevo detalle
   */
  async createDetail(data: CreateCartDetailDto): Promise<CartDetail> {
    const detail = this.repository.create(data);
    return this.repository.save(detail);
  }

  /**
   * Actualizar un detalle existente
   */
  async updateDetail(detail: CartDetail): Promise<CartDetail> {
    return this.repository.save(detail);
  }

  /**
   * Eliminar un detalle por UUID
   */
  async deleteDetail(uuid: string): Promise<boolean> {
    const result = await this.repository.delete({ uuid });
    return !!result.affected && result.affected > 0;
  }
}