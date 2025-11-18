// initial-data-loader.spec.ts
import { InitialDataLoader } from './app.service';
import { Repository } from 'typeorm';
import { Credential } from './entities/credential.entity';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';

jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {}, //mock del decorador
}));

// Reutilizable: mock de QueryRunner
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: { save: jest.fn() },
};

function createMockRepo<T extends object>(): Repository<T> {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    manager: {
      save: jest.fn(),
      connection: {
        createQueryRunner: jest.fn(() => mockQueryRunner),
      },
    },
  } as unknown as Repository<T>;
}

describe('InitialDataLoader', () => {
  let loader: InitialDataLoader;
  let mockCredentialRepo: Repository<Credential>;
  let mockUserRepo: Repository<User>;
  let mockCategoryRepo: Repository<Category>;
  let mockProductRepo: Repository<Product>;

  beforeEach(() => {
    mockCredentialRepo = createMockRepo<Credential>();
    mockUserRepo = createMockRepo<User>();
    mockCategoryRepo = createMockRepo<Category>();
    mockProductRepo = createMockRepo<Product>();

    loader = new InitialDataLoader(
      mockCredentialRepo,
      mockUserRepo,
      mockCategoryRepo,
      mockProductRepo,
    );
  });

  it('debería llamar a loaderData si no hay credenciales', async () => {
    mockCredentialRepo.count = jest.fn().mockResolvedValue(0);
    const spy = jest.spyOn(loader as any, 'loaderData').mockResolvedValue(undefined);

    await loader.onModuleInit();

    expect(spy).toHaveBeenCalled();
  });
});
