import { Test, TestingModule } from '@nestjs/testing';
import { CartDetailController } from './cartDetail.controller';
import { CartDetailService } from './cartDetail.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CartDetail } from '../entities/cartDetail.entity';
import { Cart } from '../entities/cart.entity';
import { Product } from '../entities/product.entity';
import { AddProductDto } from './dto/add-product.dto';
import { UpdateProductQuantityDto } from './dto/update-cartdetail.dto';

// Helper para crear un CartDetail mock completo
const mockCartDetail = (overrides?: Partial<CartDetail>): CartDetail => ({
  uuid: 'detail-uuid',
  quantity: 2,
  unitPrice: 10,
  subtotal: 20,
  cart: {} as Cart,
  product: {} as Product,
  ...overrides,
});

describe('CartDetailController', () => {
  let controller: CartDetailController;
  let service: jest.Mocked<CartDetailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartDetailController],
      providers: [
        {
          provide: CartDetailService,
          useValue: {
            postAddProductService: jest.fn(),
            putUpdateProductQuantityService: jest.fn(),
            deleteProductCartService: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CartDetailController>(CartDetailController);
    service = module.get(CartDetailService);
  });

  it('debería agregar un producto al carrito', async () => {
    const req = { user: { user_uuid: 'user-uuid' } };
    const dto: AddProductDto = { product_uuid: 'prod-uuid', quantity: 2 };

    service.postAddProductService.mockResolvedValue({
      message: 'Producto añadido',
      detail: mockCartDetail(),
    });

    const result = await controller.postAddProduct(req, dto);

    expect(service.postAddProductService).toHaveBeenCalledWith(req, dto);
    expect(result).toMatchObject({ message: 'Producto añadido' });
  });

  it('debería actualizar la cantidad de un producto en el carrito', async () => {
    const req = { user: { user_uuid: 'user-uuid' } };
    const dto: UpdateProductQuantityDto = { quantity: 5 };
    service.putUpdateProductQuantityService.mockResolvedValue({
      message: 'Cantidad actualizada',
      detail: mockCartDetail({ quantity: 5 }),
    });

    const result = await controller.putUpdateProductQuantity(req, 'detail-uuid', dto);

    expect(service.putUpdateProductQuantityService).toHaveBeenCalledWith(req, 'detail-uuid', dto);
    expect(result).toMatchObject({ message: 'Cantidad actualizada' });
  });

  it('debería eliminar un producto del carrito', async () => {
    const req = { user: { user_uuid: 'user-uuid' } };
    service.deleteProductCartService.mockResolvedValue({ message: 'Producto eliminado', detail: true });

    const result = await controller.deleteProductCart(req, 'detail-uuid');

    expect(service.deleteProductCartService).toHaveBeenCalledWith(req, 'detail-uuid');
    expect(result).toMatchObject({ message: 'Producto eliminado', detail: true });
  });
});
