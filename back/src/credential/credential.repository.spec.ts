import { Test, TestingModule } from '@nestjs/testing';
import { CredentialRepository } from './credential.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Credential } from '../entities/credential.entity';
import { Repository } from 'typeorm';
import { CartStatus } from 'src/enum/cart-status.enum';
import { RolesEnum } from 'src/enum/roles.enum';

describe('CredentialRepository', () => {
  let repository: CredentialRepository;
  let ormRepo: Repository<Credential>;

  const mockCredential: Credential = {
    uuid: 'cred-123',
    username: 'ana123',
    password: 'hashedpass',
    role: RolesEnum.USER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      isActive: true,
      carts: [
        { status: CartStatus.ACTIVO },
        { status: CartStatus.INACTIVO },
      ],
    } as any,
  };

  const mockOrmRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialRepository,
        {
          provide: getRepositoryToken(Credential),
          useValue: mockOrmRepo,
        },
      ],
    }).compile();

    repository = module.get<CredentialRepository>(CredentialRepository);
    ormRepo = module.get<Repository<Credential>>(getRepositoryToken(Credential));
  });

  afterEach(() => jest.clearAllMocks());

  it('debería obtener credencial por username', async () => {
    mockOrmRepo.findOne.mockResolvedValue(mockCredential);
    const result = await repository.getCredentialByUsernameRepository('ana123');
    expect(result).toEqual(mockCredential);
    expect(mockOrmRepo.findOne).toHaveBeenCalledWith({
      where: { username: 'ana123' },
      relations: ['user'],
    });
  });

  it('debería crear una nueva credencial', async () => {
    mockOrmRepo.create.mockReturnValue(mockCredential);
    mockOrmRepo.save.mockResolvedValue(mockCredential);
    const result = await repository.postCreateCredentialRepository(mockCredential);
    expect(result).toEqual(mockCredential);
    expect(mockOrmRepo.create).toHaveBeenCalledWith(mockCredential);
    expect(mockOrmRepo.save).toHaveBeenCalledWith(mockCredential);
  });

  it('debería obtener todas las credenciales', async () => {
    mockOrmRepo.find.mockResolvedValue([mockCredential]);
    const result = await repository.getAllCredentialsRepository();
    expect(result).toEqual([mockCredential]);
    expect(mockOrmRepo.find).toHaveBeenCalledWith({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  });

  it('debería obtener credencial por ID', async () => {
    mockOrmRepo.findOne.mockResolvedValue(mockCredential);
    const result = await repository.getCredentialByIdRepository('cred-123');
    expect(result).toEqual(mockCredential);
    expect(mockOrmRepo.findOne).toHaveBeenCalledWith({
      where: { uuid: 'cred-123' },
      relations: ['user'],
    });
  });

  it('debería actualizar el username', async () => {
    const dto = { username: 'nuevoUsuario' };
    mockOrmRepo.save.mockResolvedValue({ ...mockCredential, username: dto.username });
    const result = await repository.putChangeUsernameRepository(mockCredential, dto);
    expect(result?.message).toContain(dto.username);
    expect(mockOrmRepo.save).toHaveBeenCalled();
  });

  it('debería cambiar la contraseña', async () => {
    mockOrmRepo.save.mockResolvedValue({});
    const result = await repository.patchChangePasswordRepository(mockCredential, 'nuevaPass');
    expect(result?.message).toBe('Contraseña modificada correctamente.');
    expect(mockOrmRepo.save).toHaveBeenCalled();
  });

  it('debería desactivar credencial, perfil y carrito', async () => {
    const result = await repository.desactivateCredAndUserProfRepository(mockCredential);
    expect(result?.message).toContain('desactivados correctamente');
    expect(mockOrmRepo.save).toHaveBeenCalled();
    expect(mockOrmRepo.manager.save).toHaveBeenCalledTimes(2);
  });

  it('debería activar credencial, perfil y carrito', async () => {
    mockCredential.isActive = false;
    mockCredential.user.isActive = false;
    mockCredential.user.carts[1].status = CartStatus.INACTIVO;
    const result = await repository.activateCredAndUserProfRepository(mockCredential);
    expect(result?.message).toContain('activados correctamente');
    expect(mockOrmRepo.save).toHaveBeenCalled();
    expect(mockOrmRepo.manager.save).toHaveBeenCalledTimes(2);
  });

  it('debería cambiar el rol del usuario', async () => {
    const dto = { role: RolesEnum.ADMIN };
    mockOrmRepo.save.mockResolvedValue({});
    const result = await repository.putChangeUserRoleRepository(mockCredential, dto);
    expect(result?.message).toContain(dto.role);
    expect(mockOrmRepo.save).toHaveBeenCalled();
  });
});