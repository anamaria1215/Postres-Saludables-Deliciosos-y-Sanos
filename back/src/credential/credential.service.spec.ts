import { Test, TestingModule } from '@nestjs/testing';
import { CredentialService } from './credential.service';
import { CredentialRepository } from './credential.repository';
import { mockCredential } from '../../test/mocks/credential.mock';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { RolesEnum } from 'src/enum/roles.enum';

describe('CredentialService', () => {
  let service: CredentialService;
  let repository: jest.Mocked<CredentialRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialService,
        {
          provide: CredentialRepository,
          useValue: {
            getAllCredentialsRepository: jest.fn(),
            getCredentialByIdRepository: jest.fn(),
            getCredentialByUsernameRepository: jest.fn(),
            putChangeUsernameRepository: jest.fn(),
            patchChangePasswordRepository: jest.fn(),
            desactivateCredAndUserProfRepository: jest.fn(),
            activateCredAndUserProfRepository: jest.fn(),
            putChangeUserRoleRepository: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(CredentialService);
    repository = module.get(CredentialRepository);
  });

  // Obtener todas las credenciales
  it('debería obtener todas las credenciales', async () => {
    repository.getAllCredentialsRepository.mockResolvedValue([
      mockCredential({ uuid: 'cred-1' }),
    ]);

    const result = await service.getAllCredentialsService();

    expect(repository.getAllCredentialsRepository).toHaveBeenCalled();
    expect(result[0]).toMatchObject({ uuid: 'cred-1' });
  });

  // Obtener credencial por UUID
  it('debería obtener una credencial por ID', async () => {
    repository.getCredentialByIdRepository.mockResolvedValue(
      mockCredential({ uuid: 'cred-uuid' }),
    );

    const result = await service.getCredentialByIdService('cred-uuid');

    expect(repository.getCredentialByIdRepository).toHaveBeenCalledWith('cred-uuid');
    expect(result).toMatchObject({ uuid: 'cred-uuid' });
  });

  it('debería lanzar NotFound si no existe credencial', async () => {
    repository.getCredentialByIdRepository.mockResolvedValue(null);

    await expect(
      service.getCredentialByIdService('cred-uuid'),
    ).rejects.toThrow(NotFoundException);
  });

  // Cambiar username
  it('debería cambiar el username', async () => {
    const credential = mockCredential();

    repository.getCredentialByIdRepository.mockResolvedValue(credential);
    repository.getCredentialByUsernameRepository.mockResolvedValue(null);
    repository.putChangeUsernameRepository.mockResolvedValue({
      message: 'Actualizado',
    });

    const userLogged = { credential_uuid: credential.uuid, role: 'USER' };

    const result = await service.putChangeUsernameService(
      credential.uuid,
      { username: 'nuevo' },
      userLogged,
    );

    expect(result).toEqual({ message: 'Actualizado' });
  });

  // Cambiar password
  it('debería cambiar la contraseña', async () => {
    const credential = mockCredential();
    repository.getCredentialByIdRepository.mockResolvedValue(credential);
    repository.patchChangePasswordRepository.mockResolvedValue({
      message: 'Contraseña actualizada',
    });

    // simulamos bcrypt
    jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);
    jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue('hashedPass');

    const userLogged = { credential_uuid: credential.uuid };

    const result = await service.patchChangePasswordService(
      credential.uuid,
      {
        currentPassword: 'oldPass',
        newPassword: 'NewPass123!',
        confirmNewPassword: 'NewPass123!',
      },
      userLogged,
    );

    expect(result).toEqual({ message: 'Contraseña actualizada' });
  });

  // Desactivar credencial
  it('debería desactivar credencial', async () => {
    const credential = mockCredential();
    repository.getCredentialByIdRepository.mockResolvedValue(credential);
    repository.desactivateCredAndUserProfRepository.mockResolvedValue({
      message: 'Desactivada',
    });

    const userLogged = {
      credential_uuid: credential.uuid,
      role: 'USER',
    };

    const result = await service.deleteCredentialService(credential.uuid, userLogged);

    expect(result).toEqual({ message: 'Desactivada' });
  });

  // Activar credencial
  it('debería activar credencial', async () => {
    const credential = mockCredential({ isActive: false });

    repository.getCredentialByIdRepository.mockResolvedValue(credential);
    repository.activateCredAndUserProfRepository.mockResolvedValue({
      message: 'Activada',
    });

    const result = await service.activateCredentialService(credential.uuid);

    expect(result).toEqual({ message: 'Activada' });
  });

  // Cambiar rol
  it('debería cambiar el rol del usuario', async () => {
    const credential = mockCredential();
    repository.getCredentialByIdRepository.mockResolvedValue(credential);
    repository.putChangeUserRoleRepository.mockResolvedValue({
      message: 'Rol cambiado',
    });

    const result = await service.putChangeUserRole(credential.uuid, {
      role: RolesEnum.ADMIN,
    });

    expect(result).toEqual({ message: 'Rol cambiado' });
  });
});
