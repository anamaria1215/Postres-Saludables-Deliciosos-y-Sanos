import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliveryStatus } from 'src/enum/delivery-status.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

describe('DeliveryController', () => {
  let controller: DeliveryController;
  let service: DeliveryService;

  const mockService = {
    getAllDeliveriesService: jest.fn(),
    postRegisterDeliveryService: jest.fn(),
    putUpdateDeliveryStatusService: jest.fn(),
    getDeliveryByIdService: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [{ provide: DeliveryService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // permite el acceso sin validar JWT
      .compile();

    controller = module.get<DeliveryController>(DeliveryController);
    service = module.get<DeliveryService>(DeliveryService);
  });

  afterEach(() => jest.clearAllMocks());

  it('ADMIN: debería obtener todos los domicilios', async () => {
    mockService.getAllDeliveriesService.mockResolvedValue([{ uuid: 'd1' }]);

    const result = await controller.getAllDeliveries();

    expect(result).toEqual([{ uuid: 'd1' }]);
    expect(service.getAllDeliveriesService).toHaveBeenCalled();
  });

  it('ADMIN: debería registrar un domicilio', async () => {
    const dto = { order_uuid: 'o1' };
    mockService.postRegisterDeliveryService.mockResolvedValue({ message: 'ok' });

    const result = await controller.getRegisterDelivery(dto);

    expect(result).toEqual({ message: 'ok' });
    expect(service.postRegisterDeliveryService).toHaveBeenCalledWith(dto);
  });

  it('ADMIN: debería actualizar el estado de un domicilio', async () => {
    mockService.putUpdateDeliveryStatusService.mockResolvedValue({
      message: 'ok',
    });

    const updateDto = { status: DeliveryStatus.EN_CAMINO };

    const result = await controller.putUpdateDeliveryStatus('d1', updateDto);

    expect(result).toEqual({ message: 'ok' });
    expect(service.putUpdateDeliveryStatusService).toHaveBeenCalledWith('d1', updateDto);
  });

  it('ADMIN/USER: debería obtener un domicilio por ID', async () => {
    const req = { user: { uuid: 'u1' } };

    mockService.getDeliveryByIdService.mockResolvedValue({ uuid: 'd1' });

    const result = await controller.getDeliveryById('d1', req);

    expect(result).toEqual({ uuid: 'd1' });
    expect(service.getDeliveryByIdService).toHaveBeenCalledWith('d1', req);
  });
});