import { Test, TestingModule } from '@nestjs/testing';
import { CartDetailService } from './cartDetail.service';
import { CartDetailRepository } from './cartDetail.repository';
import { CartRepository } from 'src/cart/cart.repository';
import { ProductsRepository } from 'src/products/products.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Cart } from '../entities/cart.entity';
import { CartDetail } from '../entities/cartDetail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CartStatus } from '../enum/cart-status.enum';

// Helpers de entidades con tipado completo
const mockCart = (overrides?: Partial<Cart>): Cart => ({
  uuid: 'cart-uuid',
  subtotal: 0,
  status: CartStatus.ACTIVO,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: {} as User,
  cartDetail: [],
  ...overrides,
});

const mockProduct = (overrides?: Partial<Product>): Product => ({
  uuid: 'prod-uuid',
  name: 'Torta saludable',
  description: 'Descripción del producto',
  stock: 10,
  price: 20,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: {} as any,
  cartDetail: [],
  orderDetails: [],
  ...overrides,
});

const mockDetail = (overrides?: Partial<CartDetail>): CartDetail => ({
  uuid: 'detail-uuid',
  quantity: 2,
  unitPrice: 20,
  subtotal: 40,
  cart: {} as Cart,
  product: mockProduct(),
  ...overrides,
});

describe('CartDetailService', () => {
  let service: CartDetailService;
  let cartRepo: jest.Mocked<CartRepository>;
  let productRepo: jest.Mocked<ProductsRepository>;
  let detailRepo: jest.Mocked<CartDetailRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartDetailService,
        { provide: CartRepository, useValue: { getCartByUserIdRepository: jest.fn(), updateCartSubtotal: jest.fn() } },
        { provide: ProductsRepository, useValue: { getProductById: jest.fn() } },
        {
          provide: CartDetailRepository,
          useValue: {
            postAddProductRepository: jest.fn(),
            putUpdateProductQuantityRepository: jest.fn(),
            deleteProductCartRepository: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartDetailService>(CartDetailService);
    cartRepo = module.get(CartRepository);
    productRepo = module.get(ProductsRepository);
    detailRepo = module.get(CartDetailRepository);
  });

  // -------------------------------
  // postAddProductService
  // -------------------------------
  describe('postAddProductService', () => {
    it('lanza NotFoundException si no hay carrito', async () => {
      cartRepo.getCartByUserIdRepository.mockResolvedValue(null);

      await expect(
        service.postAddProductService(
          { user: { user_uuid: 'user-uuid' } },
          { product_uuid: 'prod-uuid', quantity: 1 }
        )
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza NotFoundException si no hay producto', async () => {
      cartRepo.getCartByUserIdRepository.mockResolvedValue(mockCart());
      productRepo.getProductById.mockResolvedValue(null);

      await expect(
        service.postAddProductService(
          { user: { user_uuid: 'user-uuid' } },
          { product_uuid: 'prod-uuid', quantity: 1 }
        )
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza BadRequestException si cantidad excede stock', async () => {
      cartRepo.getCartByUserIdRepository.mockResolvedValue(mockCart());
      productRepo.getProductById.mockResolvedValue(mockProduct({ stock: 2 }));

      await expect(
        service.postAddProductService(
          { user: { user_uuid: 'user-uuid' } },
          { product_uuid: 'prod-uuid', quantity: 5 }
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('crea nuevo detalle si producto no está en carrito', async () => {
      cartRepo.getCartByUserIdRepository.mockResolvedValue(mockCart());
      productRepo.getProductById.mockResolvedValue(mockProduct());
      detailRepo.postAddProductRepository.mockResolvedValue({
        message: 'Producto añadido al carrito correctamente.',
        detail: mockDetail() as any,
      });

      const result = await service.postAddProductService(
        { user: { user_uuid: 'user-uuid' } },
        { product_uuid: 'prod-uuid', quantity: 2 }
      );

      expect(detailRepo.postAddProductRepository).toHaveBeenCalledWith(
        'cart-uuid',
        { product_uuid: 'prod-uuid', quantity: 2 },
        20
      );

      expect(result).toEqual({
        message: 'Producto añadido al carrito correctamente.',
        detail: expect.objectContaining({
          uuid: 'detail-uuid',
          quantity: 2,
          unitPrice: 20,
          subtotal: 40,
          product: expect.objectContaining({
            uuid: 'prod-uuid',
            name: 'Torta saludable',
            price: 20,
            stock: 10,
          }),
        }),
      });
    });

    it('actualiza cantidad si producto ya está en carrito', async () => {
      const existingDetail = mockDetail({ quantity: 2, uuid: 'detail-uuid' });
      cartRepo.getCartByUserIdRepository.mockResolvedValue(
        mockCart({ cartDetail: [existingDetail] })
      );
      productRepo.getProductById.mockResolvedValue(mockProduct({ stock: 10, price: 20 }));
      detailRepo.putUpdateProductQuantityRepository.mockResolvedValue({
        message: 'Cantidad del producto actualizada a 4.',
        detail: mockDetail({ quantity: 4 }),
      });

      const result = await service.postAddProductService(
        { user: { user_uuid: 'user-uuid' } },
        { product_uuid: 'prod-uuid', quantity: 2 }
      );

      expect(detailRepo.putUpdateProductQuantityRepository).toHaveBeenCalledWith('detail-uuid', 4);
      expect(result).toEqual({
        message: 'Cantidad del producto actualizada a 4.',
        detail: expect.objectContaining({
          uuid: 'detail-uuid',
          quantity: 4,
          unitPrice: 20,
          product: expect.objectContaining({
            uuid: 'prod-uuid',
            name: 'Torta saludable',
          }),
        }),
      });
    });
  });

  // -------------------------------
  // putUpdateProductQuantityService
  // -------------------------------
  describe('putUpdateProductQuantityService', () => {
    it('lanza NotFoundException si no hay carrito', async () => {
      cartRepo.getCartByUserIdRepository.mockResolvedValue(null);

      await expect(
        service.putUpdateProductQuantityService(
          { user: { user_uuid: 'user-uuid' } },
          'detail-uuid',
          { quantity: 3 }
        )
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza NotFoundException si detalle no existe', async () => {
      cartRepo.getCartByUserIdRepository.mockResolvedValue(mockCart());

      await expect(
        service.putUpdateProductQuantityService(
          { user: { user_uuid: 'user-uuid' } },
          'detail-uuid',
          { quantity: 3 }
        )
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza NotFoundException si producto no existe', async () => {
      const detail = mockDetail({ uuid: 'detail-uuid' });
      cartRepo.getCartByUserIdRepository.mockResolvedValue(
        mockCart({ cartDetail: [detail] })
      );
      productRepo.getProductById.mockResolvedValue(null);

      await expect(
        service.putUpdateProductQuantityService(
          { user: { user_uuid: 'user-uuid' } },
          'detail-uuid',
          { quantity: 3 }
        )
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza BadRequestException si cantidad excede stock', async () => {
      const detail = mockDetail({ uuid: 'detail-uuid' });
      cartRepo.getCartByUserIdRepository.mockResolvedValue(
        mockCart({ cartDetail: [detail] })
      );
      productRepo.getProductById.mockResolvedValue(mockProduct({ stock: 2 }));

      await expect(
        service.putUpdateProductQuantityService(
          { user: { user_uuid: 'user-uuid' } },
          'detail-uuid',
          { quantity: 5 }
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('actualiza cantidad correctamente', async () => {
      const detail = mockDetail({ uuid: 'detail-uuid' });
      cartRepo.getCartByUserIdRepository.mockResolvedValue(
        mockCart({ cartDetail: [detail] })
      );
      productRepo.getProductById.mockResolvedValue(mockProduct({ stock: 10 }));
      detailRepo.putUpdateProductQuantityRepository.mockResolvedValue({
        message: 'Cantidad del producto actualizada a 5.',
        detail: mockDetail({ quantity: 5 }),
      });

      const result = await service.putUpdateProductQuantityService(
        { user: { user_uuid: 'user-uuid' } },
        'detail-uuid',
        { quantity: 5 }
      );

      expect(detailRepo.putUpdateProductQuantityRepository).toHaveBeenCalledWith('detail-uuid', 5);
      expect(result).toEqual({
        message: 'Cantidad del producto actualizada a 5.',
        detail: expect.objectContaining({
          uuid: 'detail-uuid',
          quantity: 5,
          unitPrice: 20,
          subtotal: 40,
          product: expect.objectContaining({
            uuid: 'prod-uuid',
            name: 'Torta saludable',
          }),
        }),
      });
    });
  });

  // -------------------------------
  // deleteProductCartService
  // -------------------------------
  describe('deleteProductCartService', () => {
    it('lanza NotFoundException si no hay carrito', async () => {
      cartRepo.getCartByUserIdRepository.mockResolvedValue(null);

      await expect(
        service.deleteProductCartService({ user: { user_uuid: 'user-uuid' } }, 'detail-uuid')
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza NotFoundException si delete devuelve null (no encontrado)', async () => {
      cartRepo.getCartByUserIdRepository.mockResolvedValue(mockCart());
      // Evitamos modificar la firma de producción forzando el tipo en el mock
      detailRepo.deleteProductCartRepository.mockResolvedValue(null as any);

      await expect(
        service.deleteProductCartService({ user: { user_uuid: 'user-uuid' } }, 'detail-uuid')
      ).rejects.toThrow(NotFoundException);
    });

    it('elimina producto correctamente y devuelve { message, detail: boolean }', async () => {
      cartRepo.getCartByUserIdRepository.mockResolvedValue(mockCart());
      detailRepo.deleteProductCartRepository.mockResolvedValue({
        message: 'Producto eliminado del carrito correctamente.',
        detail: true,
      });

      const result = await service.deleteProductCartService(
        { user: { user_uuid: 'user-uuid' } },
        'detail-uuid'
      );

      expect(detailRepo.deleteProductCartRepository).toHaveBeenCalledWith('detail-uuid');
      expect(result).toEqual({
        message: 'Producto eliminado del carrito correctamente.',
        detail: true,
      });
    });
  });
});
