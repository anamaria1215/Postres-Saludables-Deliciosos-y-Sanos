import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailController } from './orderDetail.controller';
import { OrderDetailService } from './orderDetail.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

describe('OrderDetailController', () => {
  let controller: OrderDetailController;
  let service: OrderDetailService;

  const mockService = {
    getOrderDetailsAdminService: jest.fn(),
    getOrderDetailsUserService: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailController],
      providers: [{ provide: OrderDetailService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard) 
      .useValue({ canActivate: () => true }) // Mock que permite el acceso
      .compile();

    controller = module.get<OrderDetailController>(OrderDetailController);
    service = module.get<OrderDetailService>(OrderDetailService);
  });

  afterEach(() => jest.clearAllMocks());

  // ADMIN – Ver detalles
  it('debería permitir al ADMIN ver los detalles de una orden', async () => {
    mockService.getOrderDetailsAdminService.mockResolvedValue([
      { uuid: 'detail-1' },
    ]);

    const result = await controller.getOrderDetailsAdmin('order-123');

    expect(result).toEqual([{ uuid: 'detail-1' }]);
    expect(service.getOrderDetailsAdminService).toHaveBeenCalledWith('order-123');
  });

  // USER – Ver detalles propios
  it('debería permitir al USER ver sus propios detalles de orden', async () => {
    const req = { user: { user_uuid: 'user-888' } };

    mockService.getOrderDetailsUserService.mockResolvedValue([
      { uuid: 'detail-2' },
    ]);

    const result = await controller.getOrderDetailUser(req, 'order-123');

    expect(result).toEqual([{ uuid: 'detail-2' }]);
    expect(service.getOrderDetailsUserService).toHaveBeenCalledWith(
      req,
      'order-123',
    );
  });
});