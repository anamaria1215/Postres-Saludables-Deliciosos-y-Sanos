import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: jest.Mocked<CategoriesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get(CategoriesService) as unknown as jest.Mocked<CategoriesService>;
  });

  // GET ALL
  it('debería obtener todas las categorías', async () => {
    service.findAll.mockResolvedValue([
      { uuid: '1', name: 'Pan', description: '', product: [] },
    ]);

    const result = await controller.findAll();

    expect(result.length).toBe(1);
    expect(service.findAll).toHaveBeenCalled();
  });

  // GET ONE
  it('debería obtener una categoría por UUID', async () => {
    const category = {
      uuid: 'abc',
      name: 'Tortas',
      description: 'desc',
      product: [],
    };

    service.findOne.mockResolvedValue(category);

    const result = await controller.findOne('abc');

    expect(result).toEqual(category);
    expect(service.findOne).toHaveBeenCalledWith('abc');
  });

  // CREATE
  it('debería crear una categoría', async () => {
    const dto = { name: 'Cupcakes' };

    const created = { uuid: 'x', ...dto, description: '', product: [] };

    service.create.mockResolvedValue(created);

    const result = await controller.create(dto as any);

    expect(result).toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  // UPDATE
  it('debería actualizar una categoría', async () => {
    const dto = { name: 'Nuevo' };

    const updated = {
      uuid: 'abc',
      name: 'Nuevo',
      description: '',
      product: [],
    };

    service.update.mockResolvedValue(updated);

    const result = await controller.update('abc', dto as any);

    expect(result).toEqual(updated);
    expect(service.update).toHaveBeenCalledWith('abc', dto);
  });

  // DELETE
  it('debería eliminar una categoría', async () => {
    service.delete.mockResolvedValue(true);

    const result = await controller.delete('abc');

    expect(result).toBe(true);
    expect(service.delete).toHaveBeenCalledWith('abc');
  });
});
