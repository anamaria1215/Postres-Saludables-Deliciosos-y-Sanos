import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: ProductsRepository;
  let categoriesRepository: Repository<Category>;

  const mockProductsRepository = {
    getAllProductsRepository: jest.fn(),
    getProductById: jest.fn(),
    createProductRepository: jest.fn(),
    updateProductRepository: jest.fn(),
    deleteProductsRepository: jest.fn(),
  };

  const mockCategoriesRepository = {
    findOne: jest.fn(),
  };

  const mockProductDto = {
    name: 'Brownie saludable',
    description: 'Brownie hecho con avena y stevia',
    price: 6000,
    stock: 10,
    categoryUuid: 'cat-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockProductsRepository },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<ProductsRepository>(ProductsRepository);
    categoriesRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  afterEach(() => jest.clearAllMocks());

  // Obtener todos los productos
  it('debería retornar todos los productos', async () => {
    mockProductsRepository.getAllProductsRepository.mockResolvedValue([
      { uuid: '1', name: 'Producto Test' },
    ]);

    const result = await service.getAllProducts();

    expect(result).toEqual([{ uuid: '1', name: 'Producto Test' }]);
    expect(productsRepository.getAllProductsRepository).toHaveBeenCalled();
  });

  // Obtener producto por ID (existe)
  it('debería retornar un producto por UUID', async () => {
    mockProductsRepository.getProductById.mockResolvedValue({
      uuid: 'abc123',
      name: 'Producto Test',
    });

    const result = await service.getProductById('abc123');
    expect(result.uuid).toBe('abc123');
  });

  // Obtener producto por ID (no existe)
  it('debería lanzar NotFoundException si el producto no existe', async () => {
    mockProductsRepository.getProductById.mockResolvedValue(null);

    await expect(service.getProductById('inexistente')).rejects.toThrow(
      NotFoundException,
    );
  });

  // Crear producto con categoría válida
  it('debería crear un producto si la categoría existe', async () => {
    mockCategoriesRepository.findOne.mockResolvedValue({ uuid: 'cat-123' });

    mockProductsRepository.createProductRepository.mockResolvedValue({
      ...mockProductDto,
      uuid: 'p1',
    });

    const result = await service.createProduct(mockProductDto);

    expect(result.uuid).toBe('p1');
    expect(categoriesRepository.findOne).toHaveBeenCalledWith({
      where: { uuid: mockProductDto.categoryUuid },
    });
  });

  // Crear producto con categoría inexistente
  it('debería lanzar NotFoundException si la categoría NO existe', async () => {
    mockCategoriesRepository.findOne.mockResolvedValue(null);

    await expect(service.createProduct(mockProductDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  // Actualizar producto válido
  it('debería actualizar un producto existente', async () => {
    const existing = { uuid: 'p1', name: 'Antes' };

    mockProductsRepository.getProductById.mockResolvedValue(existing);
    mockProductsRepository.updateProductRepository.mockResolvedValue({
      ...existing,
      name: 'Después',
    });

    const result = await service.updateProduct('p1', {
      name: 'Después',
    });

    expect(result.name).toBe('Después');
  });

  // Actualizar producto inexistente
  it('debería lanzar NotFoundException al actualizar un producto inexistente', async () => {
    mockProductsRepository.getProductById.mockResolvedValue(null);

    await expect(
      service.updateProduct('inexistente', { name: 'X' }),
    ).rejects.toThrow(NotFoundException);
  });

  // Eliminar producto existente
  it('debería eliminar un producto válido', async () => {
    const existing = { uuid: 'p1', name: 'Producto' };

    mockProductsRepository.getProductById.mockResolvedValue(existing);
    mockProductsRepository.deleteProductsRepository.mockResolvedValue({
      message: 'OK',
    });

    const result = await service.deleteProduct('p1');

    expect(result).toEqual({ message: 'OK' });
  });

  // Eliminar producto inexistente
  it('debería lanzar NotFoundException al eliminar un producto inexistente', async () => {
    mockProductsRepository.getProductById.mockResolvedValue(null);

    await expect(service.deleteProduct('x')).rejects.toThrow(
      NotFoundException,
    );
  });
});
