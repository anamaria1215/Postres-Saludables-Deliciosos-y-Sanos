import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CredentialRepository } from '../credential/credential.repository';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RolesEnum } from '../enum/roles.enum';
import { Credential } from '../entities/credential.entity';
import { User } from '../entities/user.entity';

//Mock global de bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(async () => 'hashedPassword'),
  compare: jest.fn(async (pass: string, hash: string) => pass === 'validPassword'),
}));

// Helper para crear un Credential mock completo
const mockCredential = (overrides?: Partial<Credential>): Credential => ({
  uuid: 'cred-uuid',
  username: 'testUser',
  password: 'hashedPassword',
  role: RolesEnum.USER,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: {
    uuid: 'user-uuid',
    name: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    phoneNumber: '123456',
    address: 'Fake Street',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    credential: {} as Credential,
    carts: [],
    orders: [],
  },
  ...overrides,
});

// Helper para crear un User mock completo
const mockUser = (overrides?: Partial<User>): User => ({
  uuid: 'user-uuid',
  name: 'Test',
  lastName: 'User',
  email: 'test@test.com',
  phoneNumber: '123456',
  address: 'Fake Street',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  credential: {} as Credential,
  carts: [],
  orders: [],
  ...overrides,
});

describe('AuthService', () => {
  let service: AuthService;
  let credentialRepository: jest.Mocked<CredentialRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CredentialRepository,
          useValue: {
            getCredentialByUsernameRepository: jest.fn(),
            postCreateCredentialRepository: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            getUserByEmailRepository: jest.fn(),
            postCreateUserRepository: jest.fn(),
          },
        },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    credentialRepository = module.get(CredentialRepository);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  it('debería registrar un usuario nuevo', async () => {
    credentialRepository.getCredentialByUsernameRepository.mockResolvedValue(null);
    credentialRepository.postCreateCredentialRepository.mockResolvedValue(mockCredential({ username: 'newUser' }));
    userRepository.getUserByEmailRepository.mockResolvedValue(null);
    userRepository.postCreateUserRepository.mockResolvedValue(mockUser({ email: 'test@test.com' }));

    const dto: any = {
      createCredentialDto: { username: 'newUser', password: '123456' },
      createUserDto: { name: 'Test', lastName: 'User', email: 'test@test.com' },
    };

    const result = await service.signUpService(dto);

    expect(result.message).toContain('registrado exitosamente');
    expect(result.credential.username).toBe('newUser');
    expect(userRepository.postCreateUserRepository).toHaveBeenCalled();
  });

  it('debería lanzar ConflictException si el username ya existe', async () => {
    credentialRepository.getCredentialByUsernameRepository.mockResolvedValue(mockCredential({ username: 'existingUser' }));

    const dto: any = {
      createCredentialDto: { username: 'existingUser', password: '123456' },
      createUserDto: { email: 'test@test.com' },
    };

    await expect(service.signUpService(dto)).rejects.toThrow(ConflictException);
  });

  it('debería lanzar ConflictException si el email ya existe', async () => {
    credentialRepository.getCredentialByUsernameRepository.mockResolvedValue(null);
    credentialRepository.postCreateCredentialRepository.mockResolvedValue(mockCredential({ username: 'newUser' }));
    userRepository.getUserByEmailRepository.mockResolvedValue(mockUser({ email: 'test@test.com' }));

    const dto: any = {
      createCredentialDto: { username: 'newUser', password: '123456' },
      createUserDto: { email: 'test@test.com' },
    };

    await expect(service.signUpService(dto)).rejects.toThrow(ConflictException);
  });

  it('debería iniciar sesión correctamente', async () => {
    const credential = mockCredential({ username: 'validUser', role: RolesEnum.ADMIN, isActive: true });
    credentialRepository.getCredentialByUsernameRepository.mockResolvedValue(credential);
    jwtService.sign.mockReturnValue('fake-jwt');

    const dto: any = { username: 'validUser', password: 'validPassword' };
    const result = await service.signInService(dto);

    expect(result.access_token).toBe('fake-jwt');
    expect(result.message).toBe('Inicio de sesión exitoso.');
  });

  it('debería lanzar NotFoundException si el usuario no existe', async () => {
    credentialRepository.getCredentialByUsernameRepository.mockResolvedValue(null);

    const dto: any = { username: 'invalidUser', password: '123456' };
    await expect(service.signInService(dto)).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar NotFoundException si la contraseña es incorrecta', async () => {
    const credential = mockCredential({ username: 'validUser', role: RolesEnum.ADMIN, isActive: true });
    credentialRepository.getCredentialByUsernameRepository.mockResolvedValue(credential);

    //aquí el cambio: mockImplementation en vez de spyOn
    (require('bcrypt').compare as jest.Mock).mockImplementation(async () => false);

    const dto: any = { username: 'validUser', password: 'wrongPassword' };
    await expect(service.signInService(dto)).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar ConflictException si el usuario está inactivo', async () => {
    const credential = mockCredential({ username: 'validUser', role: RolesEnum.ADMIN, isActive: false });
    credentialRepository.getCredentialByUsernameRepository.mockResolvedValue(credential);

    //Forzar que la contraseña sea válida
    (require('bcrypt').compare as jest.Mock).mockResolvedValue(true);

    const dto: any = { username: 'validUser', password: 'validPassword' };
    await expect(service.signInService(dto)).rejects.toThrow(ConflictException);
    });
});
