import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateOrderDto } from './DTOs/update-order.dto';

describe('OrderController', () => {
    let controller: OrderController;
    let service: OrderService;

    const mockOrderService = {
        getAllOrdersService: jest.fn(),
        putOrderStatusService: jest.fn(),
        deleteOrderService: jest.fn(),
        postCreateOrderService: jest.fn(),
        getOrdersHistoryService: jest.fn(),
        putCancelOrderService: jest.fn(),
        getOrderByIdService: jest.fn(),
    };

    const mockGuard = { canActivate: jest.fn(() => true) };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrderController],
            providers: [
                {
                    provide: OrderService,
                    useValue: mockOrderService,
                },
            ],
        })
    
            .overrideGuard(JwtAuthGuard)
            .useValue(mockGuard)
            .overrideGuard(RolesGuard)
            .useValue(mockGuard)
            .compile();

        controller = module.get<OrderController>(OrderController);
        service = module.get<OrderService>(OrderService);
    });


    afterEach(() => {
        jest.clearAllMocks();
    });

    it('debería estar definido', () => {
        expect(controller).toBeDefined();
    });

    describe('getAllOrders', () => {
        it('debería llamar al servicio.getAllOrdersService', async () => {
            mockOrderService.getAllOrdersService.mockReturnValue(['order1', 'order2']);
            const result = controller.getAllOrders();
            expect(service.getAllOrdersService).toHaveBeenCalled();
            expect(result).toEqual(['order1', 'order2']);
        });
    });

    describe('putOrderStatus', () => {
        it('debería llamar al servicio.putOrderStatusService con el uuid y dto', async () => {
            const uuid = '123e4567-e89b-12d3-a456-426614174000';
            const dto: UpdateOrderDto = { status: 'EN_CAMINO' } as UpdateOrderDto;
            mockOrderService.putOrderStatusService.mockReturnValue({ uuid, ...dto });

            const result = controller.putOrderStatus(uuid, dto);

            expect(service.putOrderStatusService).toHaveBeenCalledWith(uuid, dto);
            expect(result).toEqual({ uuid, ...dto });
        });
    });

    describe('deleteOrder', () => {
        it('debería llamar al servicio.deleteOrderService con el uuid', async () => {
            const uuid = '123e4567-e89b-12d3-a456-426614174000';
            mockOrderService.deleteOrderService.mockReturnValue({ deleted: true });

            const result = controller.deleteOrder(uuid);

            expect(service.deleteOrderService).toHaveBeenCalledWith(uuid);
            expect(result).toEqual({ deleted: true });
        });
    });

    describe('postCreateOrder', () => {
        it('debería llamar al servicio.postCreateOrderService con req', async () => {
            const req = { user: { id: 1 } };
            mockOrderService.postCreateOrderService.mockReturnValue({ orderId: 'abc' });

            const result = controller.postCreateOrder(req);

            expect(service.postCreateOrderService).toHaveBeenCalledWith(req);
            expect(result).toEqual({ orderId: 'abc' });
        });
    });

    describe('getOrdersHistory', () => {
        it('debería llamar al servicio.getOrdersHistoryService con req', async () => {
            const req = { user: { id: 1 } };
            mockOrderService.getOrdersHistoryService.mockReturnValue([{ id: 1 }]);

            const result = controller.getOrdersHistory(req);

            expect(service.getOrdersHistoryService).toHaveBeenCalledWith(req);
            expect(result).toEqual([{ id: 1 }]);
        });
    });

    describe('putCancelOrder', () => {
        it('debería llamar al servicio.putCancelOrderService con req y uuid', async () => {
            const req = { user: { id: 1 } };
            const uuid = '123e4567-e89b-12d3-a456-426614174000';
            mockOrderService.putCancelOrderService.mockReturnValue({ cancelled: true });

            const result = controller.putCancelOrder(req, uuid);

            expect(service.putCancelOrderService).toHaveBeenCalledWith(req, uuid);
            expect(result).toEqual({ cancelled: true });
        });
    });

    describe('getOrderById', () => {
        it('debería llamar al servicio.getOrderByIdService con uuid y req', async () => {
            const req = { user: { id: 1 } };
            const uuid = '123e4567-e89b-12d3-a456-426614174000';
            mockOrderService.getOrderByIdService.mockReturnValue({ id: uuid });

            const result = controller.getOrderById(uuid, req);

            expect(service.getOrderByIdService).toHaveBeenCalledWith(uuid, req);
            expect(result).toEqual({ id: uuid });
        });
    });
});
