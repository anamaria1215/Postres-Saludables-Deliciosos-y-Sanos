import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { NotFoundException } from '@nestjs/common';
import { Cart } from '../entities/cart.entity';
import { User } from '../entities/user.entity';
import { CartStatus } from 'src/enum/cart-status.enum';

// Helper para crear un Cart mock completo
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

describe('CartService', () => {
  let service: CartService;
  let repository: jest.Mocked<CartRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartRepository,
          useValue: {
            getCartByUserIdRepository: jest.fn(),
            postNewCartRepository: jest.fn(),
            deleteCartRepository: jest.fn(),
            getAllCartsRepository: jest.fn(),
            getCartByIdRepository: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    repository = module.get(CartRepository);
  });

  describe('getNewCartService', () => {
    it('debería devolver un carrito existente', async () => {
      repository.getCartByUserIdRepository.mockResolvedValue(mockCart());

      const result = await service.getNewCartService('user-uuid');

      expect(repository.getCartByUserIdRepository).toHaveBeenCalledWith('user-uuid');
      expect(result).toMatchObject({ uuid: 'cart-uuid' });
    });

    it('debería crear un nuevo carrito si no existe', async () => {
      repository.getCartByUserIdRepository.mockResolvedValue(null);
      repository.postNewCartRepository.mockResolvedValue(mockCart());

      const result = await service.getNewCartService('user-uuid');

      expect(repository.postNewCartRepository).toHaveBeenCalledWith('user-uuid');
      expect(result).toMatchObject({ uuid: 'cart-uuid' });
    });
  });

  describe('deleteCartService', () => {
    it('debería lanzar NotFoundException si el carrito no existe', async () => {
      repository.getCartByUserIdRepository.mockResolvedValue(null);

      await expect(service.deleteCartService('user-uuid')).rejects.toThrow(NotFoundException);
    });

    it('debería eliminar el carrito si existe', async () => {
      const cart = mockCart();
      repository.getCartByUserIdRepository.mockResolvedValue(cart);
      repository.deleteCartRepository.mockResolvedValue({ message: 'Carrito vaciado', cart });

      const result = await service.deleteCartService('user-uuid');

      expect(repository.deleteCartRepository).toHaveBeenCalledWith(cart);
      expect(result).toMatchObject({ message: 'Carrito vaciado' });
    });
  });

  describe('getAllCartsService', () => {
    it('debería devolver todos los carritos', async () => {
      repository.getAllCartsRepository.mockResolvedValue([mockCart({ uuid: 'cart-1' })]);

      const result = await service.getAllCartsService();

      expect(repository.getAllCartsRepository).toHaveBeenCalled();
      expect(result).toEqual([expect.objectContaining({ uuid: 'cart-1' })]);
    });
  });

  describe('getCartByIdService', () => {
    it('debería lanzar NotFoundException si el carrito no existe', async () => {
      repository.getCartByIdRepository.mockResolvedValue(null);

      await expect(service.getCartByIdService('cart-uuid')).rejects.toThrow(NotFoundException);
    });

    it('debería devolver el carrito si existe', async () => {
      repository.getCartByIdRepository.mockResolvedValue(mockCart({ uuid: 'cart-uuid' }));

      const result = await service.getCartByIdService('cart-uuid');

      expect(repository.getCartByIdRepository).toHaveBeenCalledWith('cart-uuid');
      expect(result).toMatchObject({ uuid: 'cart-uuid' });
    });
  });
});
