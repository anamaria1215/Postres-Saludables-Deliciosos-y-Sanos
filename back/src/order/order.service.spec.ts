import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { CartRepository } from 'src/cart/cart.repository';
import { OrderDetailRepository } from 'src/orderDetail/orderDetail.repository';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateOrderDto } from './DTOs/update-order.dto';

describe('OrderService', () => {
  let service: OrderService;

  const mockOrderRepository = {
    getAllOrdersRepository: jest.fn(),
    getOrderByIdRepository: jest.fn(),
    putUpdateOrderStatusRepository: jest.fn(),
    deleteOrderRepository: jest.fn(),
    postCreateOrderRepository: jest.fn(),
    getOrdersHistoryRepository: jest.fn(),
    putCancelOrderRepository: jest.fn(),
  };

  const mockCartRepository = {
    getCartByUserIdRepository: jest.fn(),
    completeCartRepository: jest.fn(),
    deleteCartRepository: jest.fn(),
  };

  const mockOrderDetailRepository = {
    postCreateOrderDetailsRepository: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useValue: mockOrderRepository },
        { provide: CartRepository, useValue: mockCartRepository },
        { provide: OrderDetailRepository, useValue: mockOrderDetailRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOrdersService', () => {
    it('debería retornar todas las órdenes', async () => {
      mockOrderRepository.getAllOrdersRepository.mockResolvedValue(['order1']);
      const result = await service.getAllOrdersService();
      expect(result).toEqual(['order1']);
      expect(mockOrderRepository.getAllOrdersRepository).toHaveBeenCalled();
    });
  });

  describe('putOrderStatusService', () => {
    it('debería lanzar NotFoundException si la orden no existe', async () => {
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(null);
      await expect(
        service.putOrderStatusService('uuid', {} as UpdateOrderDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería actualizar el estado si la orden existe', async () => {
      const order = { uuid: 'uuid' };
      const dto = { status: 'EN_CAMINO' } as UpdateOrderDto;
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(order);
      mockOrderRepository.putUpdateOrderStatusRepository.mockResolvedValue({
        ...order,
        ...dto,
      });

      const result = await service.putOrderStatusService('uuid', dto);
      expect(result).toEqual({ ...order, ...dto });
      expect(
        mockOrderRepository.putUpdateOrderStatusRepository,
      ).toHaveBeenCalledWith(order, dto);
    });
  });

  describe('deleteOrderService', () => {
    it('debería lanzar NotFoundException si la orden no existe', async () => {
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(null);
      await expect(service.deleteOrderService('uuid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería eliminar la orden si existe', async () => {
      const order = { uuid: 'uuid' };
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(order);
      mockOrderRepository.deleteOrderRepository.mockResolvedValue({
        deleted: true,
      });

      const result = await service.deleteOrderService('uuid');
      expect(result).toEqual({ deleted: true });
      expect(mockOrderRepository.deleteOrderRepository).toHaveBeenCalledWith(
        order,
      );
    });
  });

  describe('postCreateOrderService', () => {
    it('debería lanzar BadRequestException si el carrito está vacío', async () => {
      const req = { user: { user_uuid: 'user1' } };
      mockCartRepository.getCartByUserIdRepository.mockResolvedValue({
        cartDetail: [],
      });
      await expect(service.postCreateOrderService(req)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería crear orden exitosamente y procesar repositorios', async () => {
      const req = { user: { user_uuid: 'user1' } };
      const cart = {
        cartDetail: [{ product: 'p1', quantity: 2, unitPrice: 100 }],
      };
      const savedOrder = {
        uuid: 'o1',
        user: { credential: { username: 'test' } },
      };

      mockCartRepository.getCartByUserIdRepository.mockResolvedValue(cart);
      mockOrderRepository.postCreateOrderRepository.mockResolvedValue(
        savedOrder,
      );
      mockOrderDetailRepository.postCreateOrderDetailsRepository.mockResolvedValue(
        true,
      );
      mockCartRepository.completeCartRepository.mockResolvedValue(true);
      mockCartRepository.deleteCartRepository.mockResolvedValue(true);

      const result = await service.postCreateOrderService(req);

      expect(result.order).toEqual(savedOrder);
      expect(result.message).toContain('Orden de pedido con Id o1');
      expect(
        mockOrderRepository.postCreateOrderRepository,
      ).toHaveBeenCalled();
      expect(
        mockOrderDetailRepository.postCreateOrderDetailsRepository,
      ).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            product: 'p1',
            quantity: 2,
            unitPrice: 100,
            subtotal: 200,
          }),
        ]),
      );
      expect(mockCartRepository.completeCartRepository).toHaveBeenCalledWith(
        cart,
      );
      expect(mockCartRepository.deleteCartRepository).toHaveBeenCalledWith(
        cart,
      );
    });

    it('debería lanzar NotFoundException si la orden no se guarda', async () => {
      const req = { user: { user_uuid: 'user1' } };
      const cart = {
        cartDetail: [{ product: 'p1', quantity: 1, unitPrice: 50 }],
      };
      mockCartRepository.getCartByUserIdRepository.mockResolvedValue(cart);
      mockOrderRepository.postCreateOrderRepository.mockResolvedValue(null);

      await expect(service.postCreateOrderService(req)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getOrdersHistoryService', () => {
    it('debería retornar historial del usuario', async () => {
      const req = { user: { user_uuid: 'user1' } };
      mockOrderRepository.getOrdersHistoryRepository.mockResolvedValue([
        'order1',
      ]);
      const result = await service.getOrdersHistoryService(req);
      expect(result).toEqual(['order1']);
      expect(
        mockOrderRepository.getOrdersHistoryRepository,
      ).toHaveBeenCalledWith('user1');
    });
  });

  describe('putCancelOrderService', () => {
    it('debería lanzar NotFoundException si la orden no existe', async () => {
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(null);
      await expect(
        service.putCancelOrderService({ user: { user_uuid: 'u1' } }, 'uuid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException si la orden no pertenece al usuario', async () => {
      const order = { user: { uuid: 'other' }, status: 'CREADA' };
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(order);
      await expect(
        service.putCancelOrderService({ user: { user_uuid: 'u1' } }, 'uuid'),
      ).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar ConflictException si ya está cancelada', async () => {
      const order = { user: { uuid: 'u1' }, status: 'CANCELADA' };
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(order);
      await expect(
        service.putCancelOrderService({ user: { user_uuid: 'u1' } }, 'uuid'),
      ).rejects.toThrow(ConflictException);
    });

    it('debería lanzar BadRequestException si el estado no permite cancelar', async () => {
      const order = { user: { uuid: 'u1' }, status: 'EN_CAMINO' };
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(order);
      await expect(
        service.putCancelOrderService({ user: { user_uuid: 'u1' } }, 'uuid'),
      ).rejects.toThrow(BadRequestException);
    });

    it('debería cancelar la orden si es válida', async () => {
      const order = { user: { uuid: 'u1' }, status: 'CREADA' };
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(order);
      mockOrderRepository.putCancelOrderRepository.mockResolvedValue({
        cancelled: true,
      });

      const result = await service.putCancelOrderService(
        { user: { user_uuid: 'u1' } },
        'uuid',
      );
      expect(result).toEqual({ cancelled: true });
      expect(mockOrderRepository.putCancelOrderRepository).toHaveBeenCalledWith(
        order,
      );
    });
  });

  describe('getOrderByIdService', () => {
    it('debería lanzar NotFoundException si la orden no existe', async () => {
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(null);
      await expect(
        service.getOrderByIdService('uuid', {
          user: { user_uuid: 'u1', role: 'User' },
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar ForbiddenException si el usuario no es dueño y no es admin', async () => {
      const order = { user: { uuid: 'other' } };
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(order);
      await expect(
        service.getOrderByIdService('uuid', {
          user: { user_uuid: 'u1', role: 'User' },
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debería retornar la orden si el usuario es dueño', async () => {
      const order = { user: { uuid: 'u1' } };
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(order);
      const result = await service.getOrderByIdService('uuid', {
        user: { user_uuid: 'u1', role: 'User' },
      });
      expect(result).toEqual(order);
    });

    it('debería retornar la orden si el usuario es admin', async () => {
      const order = { user: { uuid: 'other' } };
      mockOrderRepository.getOrderByIdRepository.mockResolvedValue(order);
      const result = await service.getOrderByIdService('uuid', {
        user: { user_uuid: 'u1', role: 'Admin' },
      });
      expect(result).toEqual(order);
    });
  });
});
