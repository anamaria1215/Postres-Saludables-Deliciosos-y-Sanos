import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { OrderRepository } from 'src/order/order.repository';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { PaymentMethods } from 'src/enum/payment-methods.enum';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepo: jest.Mocked<PaymentRepository>;
  let orderRepo: jest.Mocked<OrderRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PaymentRepository,
          useValue: {
            getAllPaymentsRepository: jest.fn(),
            getPaymentByIdRepository: jest.fn(),
            putConfirmPaymentRepository: jest.fn(),
            putUpdatePaymentStatusRepository: jest.fn(),
            deletePaymentRepository: jest.fn(),
            getPaymentByOrderRepository: jest.fn(),
            postRegisterPaymentRepository: jest.fn(),
          },
        },
        {
          provide: OrderRepository,
          useValue: {
            getOrderByIdRepository: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(PaymentService);
    paymentRepo = module.get(PaymentRepository);
    orderRepo = module.get(OrderRepository);
  });

  // getAllPaymentsService
  describe('getAllPaymentsService', () => {
    it('retorna todos los pagos (forma del repo)', async () => {
      paymentRepo.getAllPaymentsRepository.mockResolvedValue([
        {
          message: 'ok',
          method: PaymentMethods.TARJETA,
          order: { uuid: 'o1' } as any,
          user: { uuid: 'u1' } as any,
        },
      ] as any);
      const result = await service.getAllPaymentsService();
      expect(paymentRepo.getAllPaymentsRepository).toHaveBeenCalled();
      expect(result).toEqual([
        {
          message: 'ok',
          method: PaymentMethods.TARJETA,
          order: { uuid: 'o1' },
          user: { uuid: 'u1' },
        },
      ]);
    });
  });

  // putConfirmPaymentService
  describe('putConfirmPaymentService', () => {
    it('lanza NotFoundException si no existe', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue(null);
      await expect(service.putConfirmPaymentService('uuid')).rejects.toThrow(NotFoundException);
    });

    it('lanza ConflictException si ya está confirmado', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue({ status: PaymentStatus.CONFIRMADO } as any);
      await expect(service.putConfirmPaymentService('p1')).rejects.toThrow(ConflictException);
    });

    it('devuelve la respuesta del repo (sin status en la forma)', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue({ status: PaymentStatus.PENDIENTE } as any);
      paymentRepo.putConfirmPaymentRepository.mockResolvedValue({
        message: 'Pago confirmado correctamente.',
        method: PaymentMethods.TARJETA,
        order: { uuid: 'o1' } as any,
        user: { uuid: 'u1' } as any,
      });

      const result = await service.putConfirmPaymentService('p1');
      expect(paymentRepo.putConfirmPaymentRepository).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Pago confirmado correctamente.',
        method: PaymentMethods.TARJETA,
        order: { uuid: 'o1' },
        user: { uuid: 'u1' },
      });
    });
  });

  // putUpdatePaymentStatusService
  describe('putUpdatePaymentStatusService', () => {
    it('lanza NotFoundException si no existe', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue(null);
      await expect(
        service.putUpdatePaymentStatusService('uuid', { status: PaymentStatus.FALLIDO })
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza ConflictException si el estado es el mismo', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue({ status: PaymentStatus.PENDIENTE } as any);
      await expect(
        service.putUpdatePaymentStatusService('p1', { status: PaymentStatus.PENDIENTE })
      ).rejects.toThrow(ConflictException);
    });

    it('lanza ConflictException si ya está confirmado', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue({ status: PaymentStatus.CONFIRMADO } as any);
      await expect(
        service.putUpdatePaymentStatusService('p1', { status: PaymentStatus.FALLIDO })
      ).rejects.toThrow(ConflictException);
    });

    it('devuelve la respuesta del repo (sin status en la forma)', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue({ status: PaymentStatus.PENDIENTE } as any);
      paymentRepo.putUpdatePaymentStatusRepository.mockResolvedValue({
        message: 'Estado actualizado correctamente.',
        method: PaymentMethods.TARJETA,
        order: { uuid: 'o1' } as any,
        user: { uuid: 'u1' } as any,
      } as any);

      const result = await service.putUpdatePaymentStatusService('p1', { status: PaymentStatus.FALLIDO });
      expect(paymentRepo.putUpdatePaymentStatusRepository).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Estado actualizado correctamente.',
        method: PaymentMethods.TARJETA,
        order: { uuid: 'o1' },
        user: { uuid: 'u1' },
      });
    });
  });

  // deletePaymentService
  describe('deletePaymentService', () => {
    it('lanza NotFoundException si no existe', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue(null);
      await expect(service.deletePaymentService('uuid')).rejects.toThrow(NotFoundException);
    });

    it('lanza ConflictException si ya está fallido', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue({ status: PaymentStatus.FALLIDO } as any);
      await expect(service.deletePaymentService('p1')).rejects.toThrow(ConflictException);
    });

    it('devuelve la respuesta del repo (sin status en la forma)', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue({ status: PaymentStatus.PENDIENTE } as any);
      paymentRepo.deletePaymentRepository.mockResolvedValue({
        message: 'Pago marcado como fallido.',
        method: PaymentMethods.TARJETA,
        order: { uuid: 'o1' } as any,
        user: { uuid: 'u1' } as any,
      });

      const result = await service.deletePaymentService('p1');
      expect(paymentRepo.deletePaymentRepository).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Pago marcado como fallido.',
        method: PaymentMethods.TARJETA,
        order: { uuid: 'o1' },
        user: { uuid: 'u1' },
      });
    });
  });

  // postRegisterPaymentService
  describe('postRegisterPaymentService', () => {
    const req = { user: { user_uuid: 'user-123' } };

    it('lanza NotFoundException si la orden no existe', async () => {
      orderRepo.getOrderByIdRepository.mockResolvedValue(null);
      await expect(
        service.postRegisterPaymentService(req, { order_uuid: 'o1', method: PaymentMethods.TARJETA } as any)
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza BadRequestException si la orden no pertenece al usuario', async () => {
      orderRepo.getOrderByIdRepository.mockResolvedValue({ uuid: 'o1', user: { uuid: 'other-user' }, total: 100 } as any);
      await expect(
        service.postRegisterPaymentService(req, { order_uuid: 'o1', method: PaymentMethods.TARJETA } as any)
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza ConflictException si ya existe un pago para la orden', async () => {
      orderRepo.getOrderByIdRepository.mockResolvedValue({ uuid: 'o1', user: { uuid: 'user-123' }, total: 100 } as any);
      paymentRepo.getPaymentByOrderRepository.mockResolvedValue({ uuid: 'p1' } as any);
      await expect(
        service.postRegisterPaymentService(req, { order_uuid: 'o1', method: PaymentMethods.TARJETA } as any)
      ).rejects.toThrow(ConflictException);
    });

    it('devuelve la respuesta del repo al registrar', async () => {
      orderRepo.getOrderByIdRepository.mockResolvedValue({ uuid: 'o1', user: { uuid: 'user-123' }, total: 100 } as any);
      paymentRepo.getPaymentByOrderRepository.mockResolvedValue(null);
      paymentRepo.postRegisterPaymentRepository.mockResolvedValue({
        message: 'Pago registrado correctamente.',
        method: PaymentMethods.TARJETA,
        order: { uuid: 'o1' } as any,
        user: { uuid: 'user-123' } as any,
      } as any);

      const result = await service.postRegisterPaymentService(
        req,
        { order_uuid: 'o1', method: PaymentMethods.TARJETA } as any
      );

      expect(paymentRepo.postRegisterPaymentRepository).toHaveBeenCalledWith({
        method: PaymentMethods.TARJETA,
        total: 100,
        order_uuid: 'o1',
      });
      expect(result).toEqual({
        message: 'Pago registrado correctamente.',
        method: PaymentMethods.TARJETA,
        order: { uuid: 'o1' },
        user: { uuid: 'user-123' },
      });
    });
  });

  // getPaymentByIdService
  describe('getPaymentByIdService', () => {
    it('lanza NotFoundException si no existe', async () => {
      paymentRepo.getPaymentByIdRepository.mockResolvedValue(null);
      await expect(service.getPaymentByIdService('uuid')).rejects.toThrow(NotFoundException);
    });

    it('retorna el pago si existe (forma libre del repo)', async () => {
      const payment = {
        uuid: 'p1',
        method: PaymentMethods.TARJETA,
        order: { uuid: 'o1' } as any,
        user: { uuid: 'u1' } as any,
      } as any;
      paymentRepo.getPaymentByIdRepository.mockResolvedValue(payment);

      const result = await service.getPaymentByIdService('p1');
      expect(paymentRepo.getPaymentByIdRepository).toHaveBeenCalledWith('p1');
      expect(result).toEqual(payment);
    });
  });
});