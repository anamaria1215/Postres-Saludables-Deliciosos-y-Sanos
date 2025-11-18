import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from 'src/entities/cart.entity';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
  ) {}

  //Rutas del user

  //Obtener el carrito activo
  async getNewCartService(userUuid: string) {
    //Validar que el usuario tenga un carrito activo
    let cart = await this.cartRepository.getCartByUserIdRepository(userUuid);
    
    if (!cart) {
      cart = await this.cartRepository.postNewCartRepository(userUuid);
    }
    return cart;
  }

  //Vaciar todo el carrito
  async deleteCartService(userUuid: string) {
    //Validar que exista el carrito
    const cart = await this.cartRepository.getCartByUserIdRepository(userUuid);
    if (!cart) throw new NotFoundException('Carrito no encontrado.');
    return this.cartRepository.deleteCartRepository(cart);
  }

  //Rutas del admin
  
  //Listar todos los carritos
  async getAllCartsService() {
    return await this.cartRepository.getAllCartsRepository();
  }  

  //Buscar un carrito por UUID
  async getCartByIdService(uuid: string) {
  const cart = await this.cartRepository.getCartByIdRepository(uuid);
    if (!cart) {
      throw new NotFoundException('Carrito no encontrado.')
    }
    return cart;
  }
}

