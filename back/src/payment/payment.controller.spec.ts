import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: jest.Mocked<PaymentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            getAllPaymentsService: jest.fn(),
            putConfirmPaymentService: jest.fn(),
            putUpdatePaymentStatusService: jest.fn(),
            deletePaymentService: jest.fn(),
            postRegisterPaymentService: jest.fn(),
            getPaymentByIdService: jest.fn(),
          },
        },
      ],
    })
      // 👇 sobrescribimos los guards para que no intenten resolver JwtService
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get(PaymentService);
  });

  it('debería llamar a getAllPaymentsService', () => {
    controller.getAllPayments();
    expect(service.getAllPaymentsService).toHaveBeenCalled();
  });

  it('debería llamar a putConfirmPaymentService con uuid', () => {
    controller.putConfirmRPayment('uuid-123');
    expect(service.putConfirmPaymentService).toHaveBeenCalledWith('uuid-123');
  });

  it('debería llamar a putUpdatePaymentStatusService con uuid y dto', () => {
    const dto = { status: 'CONFIRMADO' };
    controller.putUpdateStatusPayment('uuid-123', dto as any);
    expect(service.putUpdatePaymentStatusService).toHaveBeenCalledWith('uuid-123', dto);
  });

  it('debería llamar a deletePaymentService con uuid', () => {
    controller.deletePayment('uuid-123');
    expect(service.deletePaymentService).toHaveBeenCalledWith('uuid-123');
  });

  it('debería llamar a postRegisterPaymentService con req y dto', () => {
    const req = { user: { user_uuid: 'user-123' } };
    const dto = { amount: 100 };
    controller.postRegisterPayment(req as any, dto as any);
    expect(service.postRegisterPaymentService).toHaveBeenCalledWith(req, dto);
  });

  it('debería llamar a getPaymentByIdService con uuid', () => {
    controller.getPaymentById('uuid-123');
    expect(service.getPaymentByIdService).toHaveBeenCalledWith('uuid-123');
  });
});
