import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailService } from './orderDetail.service';
import { OrderDetailRepository } from './orderDetail.repository';
import { OrderRepository } from '../order/order.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('OrderDetailService', () => {
  let service: OrderDetailService;
  let orderDetailRepository: OrderDetailRepository;
  let orderRepository: OrderRepository;

  const mockOrderDetailRepository = {
    getOrderDetailsAdminRepository: jest.fn(),
    getOrderDetailsUserRepository: jest.fn(),
  };

  const mockOrderRepository = {
    getOrderByIdRepository: jest.fn(),
  };

  const mockOrder = {
    uuid: 'order-123',
    user: { uuid: 'user-999' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailService,
        { provide: OrderDetailRepository, useValue: mockOrderDetailRepository },
        { provide: OrderRepository, useValue: mockOrderRepository },
      ],
    }).compile();

    service = module.get<OrderDetailService>(OrderDetailService);
    orderDetailRepository = module.get<OrderDetailRepository>(OrderDetailRepository);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  afterEach(() => jest.clearAllMocks());

  // ADMIN – Orden existe
  it('ADMIN: debería retornar detalles de la orden si existe', async () => {
    mockOrderRepository.getOrderByIdRepository.mockResolvedValue(mockOrder);

    mockOrderDetailRepository.getOrderDetailsAdminRepository.mockResolvedValue([
      { uuid: 'detail-1' },
    ]);

    const result = await service.getOrderDetailsAdminService('order-123');
    expect(result).toEqual([{ uuid: 'detail-1' }]);
    expect(orderDetailRepository.getOrderDetailsAdminRepository).toHaveBeenCalled();
  });

  // ADMIN – Orden NO existe
  it('ADMIN: debería lanzar NotFoundException si la orden NO existe', async () => {
    mockOrderRepository.getOrderByIdRepository.mockResolvedValue(null);

    await expect(
      service.getOrderDetailsAdminService('order-xyz'),
    ).rejects.toThrow(NotFoundException);
  });

  // USER – Orden existe y pertenece al usuario
  it('USER: debería retornar detalles de la orden del usuario', async () => {
    const req = { user: { user_uuid: 'user-999' } };

    mockOrderRepository.getOrderByIdRepository.mockResolvedValue(mockOrder);
    mockOrderDetailRepository.getOrderDetailsUserRepository.mockResolvedValue([
      { uuid: 'detail-1' },
    ]);

    const result = await service.getOrderDetailsUserService(req, 'order-123');

    expect(result).toEqual([{ uuid: 'detail-1' }]);
    expect(orderDetailRepository.getOrderDetailsUserRepository).toHaveBeenCalled();
  });

  // USER – Orden NO existe
  it('USER: debería lanzar NotFoundException si la orden no existe', async () => {
    const req = { user: { user_uuid: 'abc' } };
    mockOrderRepository.getOrderByIdRepository.mockResolvedValue(null);

    await expect(
      service.getOrderDetailsUserService(req, 'order-xyz'),
    ).rejects.toThrow(NotFoundException);
  });

  // USER – Orden existe pero NO pertenece al usuario
  it('USER: debería lanzar ForbiddenException si la orden NO pertenece al usuario', async () => {
    const req = { user: { user_uuid: 'otro-user' } };

    mockOrderRepository.getOrderByIdRepository.mockResolvedValue(mockOrder);

    await expect(
      service.getOrderDetailsUserService(req, 'order-123'),
    ).rejects.toThrow(ForbiddenException);
  });
});
