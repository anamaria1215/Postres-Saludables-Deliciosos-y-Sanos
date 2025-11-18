import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
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

describe('CartController', () => {
  let controller: CartController;
  let service: jest.Mocked<CartService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            getNewCartService: jest.fn(),
            deleteCartService: jest.fn(),
            getAllCartsService: jest.fn(),
            getCartByIdService: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CartController>(CartController);
    service = module.get(CartService);
  });

  it('debería obtener el carrito activo del usuario', async () => {
    const req = { user: { user_uuid: 'user-uuid' } };
    service.getNewCartService.mockResolvedValue(mockCart());

    const result = await controller.getNewCart(req);

    expect(service.getNewCartService).toHaveBeenCalledWith('user-uuid');
    //Ignorar fechas y comparar solo propiedades relevantes
    expect(result).toMatchObject({ uuid: 'cart-uuid', status: CartStatus.ACTIVO });
  });

  it('debería vaciar el carrito activo del usuario', async () => {
    const req = { user: { user_uuid: 'user-uuid' } };
    service.deleteCartService.mockResolvedValue({ message: 'Carrito vaciado', cart: mockCart() });

    const result = await controller.deleteCart(req);

    expect(service.deleteCartService).toHaveBeenCalledWith('user-uuid');
    //Validar solo el mensaje, ignorando el objeto cart
    expect(result).toMatchObject({ message: 'Carrito vaciado' });
  });

  it('debería listar todos los carritos (ADMIN)', async () => {
    service.getAllCartsService.mockResolvedValue([
      mockCart({ uuid: 'cart-1' }),
      mockCart({ uuid: 'cart-2' }),
    ]);

    const result = await controller.getAllCarts();

    expect(service.getAllCartsService).toHaveBeenCalled();
    //Usar arrayContaining y objectContaining para ignorar fechas
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ uuid: 'cart-1' }),
        expect.objectContaining({ uuid: 'cart-2' }),
      ])
    );
  });

  it('debería obtener un carrito por UUID (ADMIN)', async () => {
    service.getCartByIdService.mockResolvedValue(mockCart({ uuid: 'cart-uuid' }));

    const result = await controller.getCartById('cart-uuid');

    expect(service.getCartByIdService).toHaveBeenCalledWith('cart-uuid');
    //Comparar solo uuid y status
    expect(result).toMatchObject({ uuid: 'cart-uuid', status: CartStatus.ACTIVO });
  });
});
