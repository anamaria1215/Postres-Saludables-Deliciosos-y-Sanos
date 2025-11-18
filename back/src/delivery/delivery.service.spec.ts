import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { DeliveryRepository } from './delivery.repository';
import { OrderRepository } from '../order/order.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus } from '../enum/payment-status.enum';
import { RolesEnum } from '../enum/roles.enum';
import { DeliveryStatus } from '../enum/delivery-status.enum';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let deliveryRepository: DeliveryRepository;
  let orderRepository: OrderRepository;

  const mockDeliveryRepository = {
    getAllDeliveriesRepository: jest.fn(),
    postRegisterDeliveryRepository: jest.fn(),
    getDeliveryByIdRepository: jest.fn(),
    putUpdateDeliveryStatusRepository: jest.fn(),
  };

  const mockOrderRepository = {
    getOrderByIdRepository: jest.fn(),
  };

  const mockOrder = {
    uuid: 'order-123',
    user: {
      uuid: 'user-999',
      address: 'Calle 123',
      phoneNumber: '3000000000',
    },
    payment: {
      status: PaymentStatus.CONFIRMADO,
    },
    delivery: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        { provide: DeliveryRepository, useValue: mockDeliveryRepository },
        { provide: OrderRepository, useValue: mockOrderRepository },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    deliveryRepository = module.get<DeliveryRepository>(DeliveryRepository);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  afterEach(() => jest.clearAllMocks());

  // ADMIN - GET ALL
  
  it('ADMIN: debería obtener todos los domicilios', async () => {
    mockDeliveryRepository.getAllDeliveriesRepository.mockResolvedValue([
      { uuid: 'd1' },
    ]);

    const result = await service.getAllDeliveriesService();
    expect(result).toEqual([{ uuid: 'd1' }]);
    expect(deliveryRepository.getAllDeliveriesRepository).toHaveBeenCalled();
  });

  // ADMIN - REGISTER DELIVERY

  it('ADMIN: debería registrar un domicilio si todo está correcto', async () => {
    mockOrderRepository.getOrderByIdRepository.mockResolvedValue(mockOrder);

    mockDeliveryRepository.postRegisterDeliveryRepository.mockResolvedValue({
      message: 'OK',
    });

    const result = await service.postRegisterDeliveryService({
      order_uuid: 'order-123',
    });

    expect(result).toEqual({ message: 'OK' });
  });

  it('ADMIN: debería lanzar NotFoundException si la orden no existe', async () => {
    mockOrderRepository.getOrderByIdRepository.mockResolvedValue(null);

    await expect(
      service.postRegisterDeliveryService({ order_uuid: 'xyz' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('ADMIN: debería lanzar BadRequest si la orden no tiene usuario', async () => {
    mockOrderRepository.getOrderByIdRepository.mockResolvedValue({
      ...mockOrder,
      user: null,
    });

    await expect(
      service.postRegisterDeliveryService({ order_uuid: 'order-123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('ADMIN: debería lanzar BadRequest si la orden no tiene pago', async () => {
    mockOrderRepository.getOrderByIdRepository.mockResolvedValue({
      ...mockOrder,
      payment: null,
    });

    await expect(
      service.postRegisterDeliveryService({ order_uuid: 'order-123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('ADMIN: debería lanzar BadRequest si el pago no está confirmado', async () => {
    mockOrderRepository.getOrderByIdRepository.mockResolvedValue({
      ...mockOrder,
      payment: { status: PaymentStatus.PENDIENTE },
    });

    await expect(
      service.postRegisterDeliveryService({ order_uuid: 'order-123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('ADMIN: debería lanzar BadRequest si la orden ya tiene domicilio', async () => {
    mockOrderRepository.getOrderByIdRepository.mockResolvedValue({
      ...mockOrder,
      delivery: { uuid: 'd1' },
    });

    await expect(
      service.postRegisterDeliveryService({ order_uuid: 'order-123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('ADMIN: debería lanzar BadRequest si el usuario no tiene address', async () => {
    mockOrderRepository.getOrderByIdRepository.mockResolvedValue({
      ...mockOrder,
      user: { uuid: 'user-999', address: null, phoneNumber: '30000' },
    });

    await expect(
      service.postRegisterDeliveryService({ order_uuid: 'order-123' }),
    ).rejects.toThrow(BadRequestException);
  });

  // ADMIN - UPDATE DELIVERY STATUS

  it('ADMIN: debería actualizar el estado de un domicilio', async () => {
    const mockDelivery = {
      uuid: 'd1',
      order: { uuid: 'order-123' },
      status: DeliveryStatus.ENVIADO,
    };

    mockDeliveryRepository.getDeliveryByIdRepository.mockResolvedValue(
      mockDelivery,
    );

    mockDeliveryRepository.putUpdateDeliveryStatusRepository.mockResolvedValue({
      message: 'Estado actualizado',
    });

    const result = await service.putUpdateDeliveryStatusService('d1', {
      status: DeliveryStatus.ENTREGADO,
    });

    expect(result).toEqual({ message: 'Estado actualizado' });
  });

  it('ADMIN: debería lanzar NotFound si el delivery no existe', async () => {
    mockDeliveryRepository.getDeliveryByIdRepository.mockResolvedValue(null);

    await expect(
      service.putUpdateDeliveryStatusService('d1', {
        status: DeliveryStatus.EN_CAMINO,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  // USER & ADMIN - GET BY ID

  it('USER: debería obtener su propio domicilio', async () => {
    const req = {
      user: { user_uuid: 'user-999', role: RolesEnum.USER },
    };

    const mockDelivery = {
      uuid: 'd1',
      order: { user: { uuid: 'user-999' } },
    };

    mockDeliveryRepository.getDeliveryByIdRepository.mockResolvedValue(
      mockDelivery,
    );

    const result = await service.getDeliveryByIdService('d1', req);

    expect(result).toEqual(mockDelivery);
  });

  it('USER: debería lanzar Forbidden si intenta ver domicilio de otro usuario', async () => {
    const req = {
      user: { user_uuid: 'otro', role: RolesEnum.USER },
    };

    mockDeliveryRepository.getDeliveryByIdRepository.mockResolvedValue({
      uuid: 'd1',
      order: { user: { uuid: 'user-999' } },
    });

    await expect(service.getDeliveryByIdService('d1', req)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('ADMIN: debería ver cualquier domicilio', async () => {
    const req = {
      user: { user_uuid: 'admin', role: RolesEnum.ADMIN },
    };

    const mockDelivery = {
      uuid: 'd1',
      order: { user: { uuid: 'user-999' } },
    };

    mockDeliveryRepository.getDeliveryByIdRepository.mockResolvedValue(
      mockDelivery,
    );

    const result = await service.getDeliveryByIdService('d1', req);

    expect(result).toEqual(mockDelivery);
  });

  it('should throw NotFound if delivery does not exist', async () => {
    mockDeliveryRepository.getDeliveryByIdRepository.mockResolvedValue(null);

    const req = { user: { user_uuid: 'x', role: RolesEnum.ADMIN } };

    await expect(service.getDeliveryByIdService('x', req)).rejects.toThrow(
      NotFoundException,
    );
  });
});
