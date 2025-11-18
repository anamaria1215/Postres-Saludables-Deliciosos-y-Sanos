import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import {
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UpdateUserDto } from './Dtos/updateUser.dto';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    getUserByNameRepository: jest.fn(),
    getUserByNameAndLastNameRepository: jest.fn(),
    getAllUsersRepository: jest.fn(),
    getUserByIdRepository: jest.fn(),
    getUserByEmailRepository: jest.fn(),
    putUpdateUserProfileRepository: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByNameService', () => {
    it('debería retornar usuarios cuando existen', async () => {
      const users = [{ uuid: 'u1' }];
      mockUserRepository.getUserByNameRepository.mockResolvedValue(users);
      const result = await service.getUserByNameService('John');
      expect(result).toEqual(users);
      expect(mockUserRepository.getUserByNameRepository).toHaveBeenCalledWith('John');
    });

    it('debería lanzar NotFoundException cuando no hay resultados', async () => {
      mockUserRepository.getUserByNameRepository.mockResolvedValue([]);
      await expect(service.getUserByNameService('John')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserByNameAndLastNameService', () => {
    it('debería retornar usuarios cuando existen', async () => {
      const users = [{ uuid: 'u1' }];
      mockUserRepository.getUserByNameAndLastNameRepository.mockResolvedValue(users);
      const result = await service.getUserByNameAndLastNameService('John', 'Doe');
      expect(result).toEqual(users);
      expect(mockUserRepository.getUserByNameAndLastNameRepository).toHaveBeenCalledWith('John', 'Doe');
    });

    it('debería lanzar NotFoundException cuando no hay resultados', async () => {
      mockUserRepository.getUserByNameAndLastNameRepository.mockResolvedValue([]);
      await expect(service.getUserByNameAndLastNameService('John', 'Doe')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUsersService', () => {
    it('debería retornar todos los usuarios', async () => {
      const users = [{ uuid: 'u1' }, { uuid: 'u2' }];
      mockUserRepository.getAllUsersRepository.mockResolvedValue(users);
      const result = await service.getAllUsersService();
      expect(result).toEqual(users);
      expect(mockUserRepository.getAllUsersRepository).toHaveBeenCalled();
    });
  });

  describe('getUserByIdService', () => {
    it('debería retornar el usuario si existe', async () => {
      const user = { uuid: 'u1' };
      mockUserRepository.getUserByIdRepository.mockResolvedValue(user);
      const result = await service.getUserByIdService('u1');
      expect(result).toEqual(user);
      expect(mockUserRepository.getUserByIdRepository).toHaveBeenCalledWith('u1');
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockUserRepository.getUserByIdRepository.mockResolvedValue(null);
      await expect(service.getUserByIdService('u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserProfileService', () => {
    it('debería retornar el perfil cuando existe y está activo', async () => {
      const req = { user: { user_uuid: 'u1' } };
      const user = { uuid: 'u1', isActive: true };
      mockUserRepository.getUserByIdRepository.mockResolvedValue(user);

      const result = await service.getUserProfileService(req);
      expect(result).toEqual(user);
      expect(mockUserRepository.getUserByIdRepository).toHaveBeenCalledWith('u1');
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      const req = { user: { user_uuid: 'u1' } };
      mockUserRepository.getUserByIdRepository.mockResolvedValue(null);
      await expect(service.getUserProfileService(req)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar ConflictException si está desactivado', async () => {
      const req = { user: { user_uuid: 'u1' } };
      const user = { uuid: 'u1', isActive: false };
      mockUserRepository.getUserByIdRepository.mockResolvedValue(user);
      await expect(service.getUserProfileService(req)).rejects.toThrow(ConflictException);
    });
  });

  describe('putUpdateUserProfileService', () => {
    it('debería actualizar perfil cuando el usuario existe y está activo', async () => {
      const req = { user: { user_uuid: 'u1' } };
      const dto: UpdateUserDto = { name: 'John', email: 'john@example.com' } as UpdateUserDto;
      const user = { uuid: 'u1', isActive: true };
      mockUserRepository.getUserByIdRepository.mockResolvedValue(user);
      mockUserRepository.getUserByEmailRepository.mockResolvedValue(null);
      const updated = { ...user, ...dto };
      mockUserRepository.putUpdateUserProfileRepository.mockResolvedValue(updated);

      const result = await service.putUpdateUserProfileService(req, dto);
      expect(result).toEqual(updated);
      expect(mockUserRepository.getUserByIdRepository).toHaveBeenCalledWith('u1');
      expect(mockUserRepository.getUserByEmailRepository).toHaveBeenCalledWith('john@example.com');
      expect(mockUserRepository.putUpdateUserProfileRepository).toHaveBeenCalledWith(user, dto);
    });

    it('debería permitir actualizar si el email no cambia o pertenece al mismo usuario', async () => {
      const req = { user: { user_uuid: 'u1' } };
      const dto: UpdateUserDto = { email: 'same@example.com' } as UpdateUserDto;
      const user = { uuid: 'u1', isActive: true };
      mockUserRepository.getUserByIdRepository.mockResolvedValue(user);
      mockUserRepository.getUserByEmailRepository.mockResolvedValue({ uuid: 'u1' });
      mockUserRepository.putUpdateUserProfileRepository.mockResolvedValue({ ...user, ...dto });

      const result = await service.putUpdateUserProfileService(req, dto);
      expect(result).toEqual({ ...user, ...dto });
      expect(mockUserRepository.putUpdateUserProfileRepository).toHaveBeenCalledWith(user, dto);
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      const req = { user: { user_uuid: 'u1' } };
      const dto: UpdateUserDto = { name: 'John' } as UpdateUserDto;
      mockUserRepository.getUserByIdRepository.mockResolvedValue(null);

      await expect(service.putUpdateUserProfileService(req, dto)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar ConflictException si el usuario está desactivado', async () => {
      const req = { user: { user_uuid: 'u1' } };
      const dto: UpdateUserDto = { name: 'John' } as UpdateUserDto;
      const user = { uuid: 'u1', isActive: false };
      mockUserRepository.getUserByIdRepository.mockResolvedValue(user);

      await expect(service.putUpdateUserProfileService(req, dto)).rejects.toThrow(ConflictException);
    });

    it('debería lanzar ConflictException si el email ya existe y pertenece a otro usuario', async () => {
      const req = { user: { user_uuid: 'u1' } };
      const dto: UpdateUserDto = { email: 'taken@example.com' } as UpdateUserDto;
      const user = { uuid: 'u1', isActive: true };
      mockUserRepository.getUserByIdRepository.mockResolvedValue(user);
      mockUserRepository.getUserByEmailRepository.mockResolvedValue({ uuid: 'u2' });

      await expect(service.putUpdateUserProfileService(req, dto)).rejects.toThrow(ConflictException);
    });
  });
});
