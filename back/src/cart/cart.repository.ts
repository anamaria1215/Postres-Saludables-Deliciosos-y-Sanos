import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartStatus } from 'src/enum/cart-status.enum';
import { CartDetail } from 'src/entities/cartDetail.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartDetail)
    private readonly cartDetailRepository: Repository<CartDetail>
  ) {}

  //Método para obtener carrito por usuario
  async getCartByUserIdRepository(userUuid: string) {
    console.log('Se envió la respuesta del getCartByUserId.');
    return await this.cartRepository.findOne({
      where: { 
        user: { uuid : userUuid }, 
        status: CartStatus.ACTIVO,
      },
      relations: [
        'user',
        'cartDetail', 
        'cartDetail.product'
      ],
    });
  }

  //Método para recalcular el subtotal del carrito
  async updateCartSubtotal(cartUuid: string) {
    // Traer todos los detalles del carrito
    const details = await this.cartDetailRepository.find({
      where: { cart: { uuid: cartUuid } },
    });

    // Sumar subtotales
    const subtotal = details.reduce(
      (acc, d) => acc + Number(d.subtotal || 0),
      0
    );

    // Actualizar el carrito
    await this.cartRepository.update(
      { uuid: cartUuid },
      { subtotal }
    );
    console.log('Subtotal actualizado en el carrito correctamente.');
    return subtotal;
  }

  //Método para completar el carrito (cambiar estado a COMPLETADO)
  async completeCartRepository(cart: Cart) {
    cart.status = CartStatus.COMPLETADO;
    return await this.cartRepository.save(cart);
  }

  // Crear nuevo carrito (si el usuario no tiene uno)
  async postNewCartRepository(userUuid: string) {
    const newCart = this.cartRepository.create({ 
      status: CartStatus.ACTIVO,
      user: { uuid: userUuid } });
    console.log('Se envió la respuesta del postNewCart.');
    return await this.cartRepository.save(newCart);
  }

  //Ruta para vaciar todo el carrito
  async deleteCartRepository(cart: Cart) {
    //Borrar los detalles asociados directamente en la base de datos
    await this.cartDetailRepository.manager.delete( 
      CartDetail, 
      { cart: { uuid: cart.uuid } },
    );
    //Limpiar la relación en memoria y guardar el carrito vacío
    cart.cartDetail = [];
    //Actualizar subtotal
    cart.subtotal = 0;
    await this.cartRepository.save(cart);
    console.log('Se envió la respuesta del deleteCart.');
    return {
      message: 'Carrito vacío. Puedes volver a llenarlo.',
      cart: cart,
    };
  }

  //Rutas del admin
  //Listar todos los carritos
  async getAllCartsRepository() {
    return await this.cartRepository.find({
      order: { createdAt: 'DESC' },
      relations: [
        'user',
      ],
    });
  }

  //Buscar un carrito por UUID
  async getCartByIdRepository(uuid: string){
    return await this.cartRepository.findOne({
      where: { uuid : uuid },
      relations: ['user'],
    });
  }
}
