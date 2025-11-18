import { Injectable, NotFoundException } from '@nestjs/common';
import { CartDetailRepository } from './cart_detail.repository';
import { CreateCartDetailDto } from './dto/create-cartdetail.dto';
import { UpdateCartDetailDto } from './dto/update-cartdetail.dto';
import { CartDetail } from '../entities/cart_detail.entity';


@Injectable()
export class CartDetailService {
  constructor(private readonly cartDetailRepository: CartDetailRepository) {}

  /**
   * Obtener todos los detalles de los carritos
   */
  async findAll(): Promise<CartDetail[]> {
    return this.cartDetailRepository.findAll();
  }

  /**
   * Obtener un detalle por UUID
   */
  async findOne(uuid: string): Promise<CartDetail> {
    const detail = await this.cartDetailRepository.findOne(uuid);
    if (!detail) {
      throw new NotFoundException(`No se encontró el detalle con UUID: ${uuid}`);
    }
    return detail;
  }

  /**
   * Crear un nuevo detalle de carrito
   */
  async create(dto: CreateCartDetailDto): Promise<CartDetail> {
    return this.cartDetailRepository.createDetail(dto);
  }

  /**
   * Actualizar un detalle existente
   */
  async update(uuid: string, dto: UpdateCartDetailDto): Promise<CartDetail> {
    const existing = await this.findOne(uuid);
    Object.assign(existing, dto);
    return this.cartDetailRepository.updateDetail(existing);
  }

  /**
   * Eliminar un detalle de carrito
   */
  async delete(uuid: string): Promise<boolean> {
    const deleted = await this.cartDetailRepository.deleteDetail(uuid);
    if (!deleted) {
      throw new NotFoundException(`No se pudo eliminar el detalle con UUID: ${uuid}`);
    }
    return deleted;
  }
}
