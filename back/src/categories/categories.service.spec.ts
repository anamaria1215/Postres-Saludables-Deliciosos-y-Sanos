import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: jest.Mocked<Repository<Category>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    // cast para que TS considere esto un Mocked Repository
    repository = module.get(getRepositoryToken(Category)) as unknown as jest.Mocked<Repository<Category>>;
  });

  // findAll
  it('debería obtener todas las categorías', async () => {
    const mockCategory: Category[] = [
      { uuid: '1', name: 'Postres', description: 'dulces', product: [] },
    ];

    repository.find.mockResolvedValue(mockCategory);

    const result = await service.findAll();

    expect(result).toEqual(mockCategory);
    expect(repository.find).toHaveBeenCalled();
  });

  // findOne SUCCESS
  it('debería obtener una categoría por UUID', async () => {
    const mockCat: Category = { uuid: 'abc', name: 'Pan', description: '', product: [] };

    repository.findOne.mockResolvedValue(mockCat);

    const result = await service.findOne('abc');

    expect(repository.findOne).toHaveBeenCalledWith({ where: { uuid: 'abc' } });
    expect(result).toBe(mockCat);
  });

  // findOne ERROR
  it('debería lanzar NotFoundException si la categoría no existe', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne('fake')).rejects.toThrow(NotFoundException);
  });

  // create SUCCESS
  it('debería crear una nueva categoría', async () => {
    const dto = { name: 'Galletas', description: 'ricas' };

    const created: Category = { uuid: '1', ...dto, product: [] };

    (repository.create as jest.Mock).mockReturnValue(created);
    repository.save.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(result).toEqual(created);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(created);
  });

  // create ERROR
  it('debería lanzar BadRequestException si algo falla al crear', async () => {
    (repository.create as jest.Mock).mockReturnValue({});
    repository.save.mockRejectedValue(new Error());

    await expect(service.create({ name: 'Algo' } as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  // update SUCCESS
  it('debería actualizar una categoría', async () => {
    const existing: Category = {
      uuid: 'x1',
      name: 'Antigua',
      description: 'desc',
      product: [],
    };

    repository.findOne.mockResolvedValue(existing);
    repository.save.mockResolvedValue({
      ...existing,
      name: 'Nueva',
    });

    const result = await service.update('x1', { name: 'Nueva' });

    expect(result.name).toBe('Nueva');
    expect(repository.save).toHaveBeenCalled();
  });

  // update ERROR (findOne)
  it('debería lanzar NotFoundException si update no encuentra categoría', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.update('id', {} as any)).rejects.toThrow(NotFoundException);
  });

  // update ERROR (save)
  it('debería lanzar BadRequestException si falla el save', async () => {
    const existing: Category = {
      uuid: 'x1',
      name: 'Cat',
      description: '',
      product: [],
    };

    repository.findOne.mockResolvedValue(existing);
    repository.save.mockRejectedValue(new Error());

    await expect(service.update('x1', { name: 'new' })).rejects.toThrow(
      BadRequestException,
    );
  });

  // delete SUCCESS
  it('debería eliminar una categoría', async () => {
    // TypeORM DeleteResult incluye raw y affected; simulamos ambos
    repository.delete.mockResolvedValue({ raw: {}, affected: 1 } as any);

    const result = await service.delete('abc');

    expect(result).toBe(true);
    expect(repository.delete).toHaveBeenCalledWith({ uuid: 'abc' });
  });

  // delete ERROR
  it('debería lanzar NotFoundException si no se puede eliminar', async () => {
    repository.delete.mockResolvedValue({ raw: {}, affected: 0 } as any);

    await expect(service.delete('bad-id')).rejects.toThrow(NotFoundException);
  });
});
