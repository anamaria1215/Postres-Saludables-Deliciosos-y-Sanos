import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockService = {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  const dto = {
    name: 'Brownie saludable',
    description: 'Brownie hecho con avena y stevia',
    price: 6000,
    stock: 10,
    categoryUuid: 'cat-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard) // 
      .useValue({ canActivate: () => true }) 
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => jest.clearAllMocks());

  // Obtener todos los productos
  it('debería obtener todos los productos', async () => {
    mockService.getAllProducts.mockResolvedValue(['p1', 'p2']);

    const result = await controller.getAll();
    expect(result).toEqual(['p1', 'p2']);
  });

  // Obtener por UUID
  it('debería retornar un producto por ID', async () => {
    mockService.getProductById.mockResolvedValue({ uuid: '123' });

    const result = await controller.getById('123');
    expect(result.uuid).toBe('123');
  });

  // Crear producto
  it('debería crear un producto', async () => {
    mockService.createProduct.mockResolvedValue({ uuid: '1', ...dto });

    const result = await controller.create(dto);

    expect(result).toEqual({ uuid: '1', ...dto });
    expect(service.createProduct).toHaveBeenCalledWith(dto);
  });

  // Actualizar producto
  it('debería actualizar un producto', async () => {
    const res = { uuid: '1', name: 'Actualizado' };

    mockService.updateProduct.mockResolvedValue(res);

    const result = await controller.update('1', { name: 'Actualizado' });

    expect(result).toEqual(res);
  });

  // Eliminar producto
  it('debería eliminar un producto', async () => {
    const res = { message: 'Eliminado' };

    mockService.deleteProduct.mockResolvedValue(res);

    const result = await controller.delete('1');
    expect(result).toEqual(res);
  });
});