import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddProductDto } from './DTOs/add-product.dto';
import { CartRepository } from 'src/cart/cart.repository';
import { ProductsRepository } from 'src/products/products.repository';
import { CartDetailRepository } from './cartDetail.repository';
import { UpdateProductQuantityDto } from './DTOs/update-cartdetail.dto';

@Injectable()
export class CartDetailService {
    constructor(
        private readonly cartDetailRepository: CartDetailRepository,
        private readonly cartRepository: CartRepository,
        private readonly productsRepository: ProductsRepository,
    ) {}

    //Rutas del user

    //Agregar un producto al carrito
    async postAddProductService(
        req: any,
        addProductDto: AddProductDto
    ) {
        const userId = req.user.user_uuid; //Viene del JWT
        //Obtener carrito del usuario
        const cart = await this.cartRepository.getCartByUserIdRepository(userId);
        if (!cart) throw new NotFoundException('Carrito no encontrado.');
        //Verificar si el producto ya está en el carrito
        let detail = cart.cartDetail.find(d => (addProductDto.product_uuid && d.product?.uuid === addProductDto.product_uuid));
        //Obtener precio del producto
        let unitPrice = 0;

        if (addProductDto.product_uuid) {

            const product = await this.productsRepository.getProductById(addProductDto.product_uuid)
            if (!product) throw new NotFoundException('Producto no encontrado.');
            //Validar stock disponible
            if (addProductDto.quantity > product.stock) {
                throw new BadRequestException(
                    `Solo hay ${product.stock} unidades disponibles de ${product.name}.`
                );
            }

            unitPrice = Number(product.price);

            //Actualizar cantidad si ya existe
            if (detail) {
                const newQuantity = detail.quantity + addProductDto.quantity;

                //Validar stock
                if (newQuantity > product.stock) {
                    throw new BadRequestException(
                        `No puedes agregar ${addProductDto.quantity} unidades más. Solo hay ${product.stock} disponibles.`
                    );
                }

                return this.cartDetailRepository.putUpdateProductQuantityRepository(
                    detail.uuid, 
                    newQuantity
                );
            }

            //Crear nuevo detalle
            return this.cartDetailRepository.postAddProductRepository(
                cart.uuid, 
                addProductDto, 
                unitPrice
            );
        }
    }

    //Actualizar cantidad de un producto
    async putUpdateProductQuantityService(
        req: any,
        uuid: string,
        updateProductQuantityDto: UpdateProductQuantityDto
    ) {
        const userUuid = req.user.user_uuid; //Viene del JWT

        //Obtener carrito del usuario
        const cart = await this.cartRepository.getCartByUserIdRepository(userUuid);
        if (!cart) throw new NotFoundException('Carrito no encontrado.');

        //Obtener el detalle del carrito
        const detail = cart.cartDetail.find(d => d.uuid === uuid);
        if (!detail) throw new NotFoundException('Producto no encontrado en el carrito.');

        //Obtener el producto
        const product = await this.productsRepository.getProductById(detail.product.uuid);
        if (!product) throw new NotFoundException('Producto no encontrado.');

        //Validar stock
        if (updateProductQuantityDto.quantity > product.stock) {
            throw new BadRequestException(
                `Solo hay ${product.stock} unidades disponibles de ${product.name}.`
            );
        }

        //Actualizar en el repository
        return this.cartDetailRepository.putUpdateProductQuantityRepository(
            uuid,
            updateProductQuantityDto.quantity
        );
    }

    //Eliminar un producto del carrito
    async deleteProductCartService(
        req: any,
        uuid: string
    ) {
        const userId = req.user.user_uuid; //Viene del JWT
        //Obtener carrito del usuario
        const cart = await this.cartRepository.getCartByUserIdRepository(userId);
        if (!cart) throw new NotFoundException('Carrito no encontrado.');
        
        const productDetail = await this.cartDetailRepository.deleteProductCartRepository(uuid);
        if (!productDetail) throw new NotFoundException('Producto no encontrado en el carrito.');
        return productDetail;
    }
}