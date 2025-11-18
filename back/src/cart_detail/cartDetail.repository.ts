import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddProductDto } from "./DTOs/add-product.dto";
import { CartDetail } from "src/entities/cartDetail.entity";
import { CartRepository } from "src/cart/cart.repository";

@Injectable()
export class CartDetailRepository {
    constructor(
        @InjectRepository(CartDetail)
        private readonly cartDetailRepository: Repository<CartDetail>,
        private readonly cartRepository: CartRepository
    ) {}
    
    //Rutas del user

    //Agregar un producto al carrito
    async postAddProductRepository(
        uuid: string,
        addProductDto: AddProductDto,
        unitPrice: number
    ) {
        const newDetail = this.cartDetailRepository.create({
            cart: { uuid: uuid } as any,
            product: addProductDto.product_uuid
            ? ({ uuid: addProductDto.product_uuid } as any)
            : null,
            quantity: addProductDto.quantity,
            unitPrice,
            subtotal: addProductDto.quantity * unitPrice,
        } as any);
        const savedDetail = await this.cartDetailRepository.save(newDetail);
        //Actualizar subtotal del carrito
        await this.cartRepository.updateCartSubtotal(uuid);
        console.log('Se envío la respuesta del postAddProduct.');
        return {
            message: 'Producto añadido al carrito correctamente.',
            detail: savedDetail,
        };
    }

    //Actualizar cantidad de un producto
    async putUpdateProductQuantityRepository(
        uuid: string,
        quantity: number
    ) {
        const updateDetail = await this.cartDetailRepository.findOne({ 
            where: { uuid : uuid },
            relations: ['product', 'cart'],
        });
        if (!updateDetail) return null;

        updateDetail.quantity = quantity;
        updateDetail.subtotal = quantity * Number(updateDetail.unitPrice);
        const savedDetail = await this.cartDetailRepository.save(updateDetail);
        //Actualizar subtotal del carrito
        await this.cartRepository.updateCartSubtotal(updateDetail.cart.uuid);
        console.log('Se envió la respuesta del putUpdateProductQuantity.');
        return {
            message: `Cantidad del producto actualizada a ${quantity}.`,
            detail: savedDetail,
        };
    }

    //Eliminar un producto específico del carrito
    async deleteProductCartRepository(
        uuid: string
    ) {
        const detail = await this.cartDetailRepository.findOne({
            where: { uuid: uuid },
            relations: ['product', 'cart'],
        });
        const result = await this.cartDetailRepository.delete({ 
            uuid : uuid,
        });
        const deleted = !!result?.affected && result.affected > 0;
        if (deleted && detail) {
            //Actualizar subtotal del carrito
            await this.cartRepository.updateCartSubtotal(detail.cart.uuid);
        }
        console.log('Se envió la respuesta del deleteProductCart.');
        return { 
            message: 'Producto eliminado del carrito correctamente.',
            detail: deleted
        };
    }
}