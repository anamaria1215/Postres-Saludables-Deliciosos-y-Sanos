import { Test, TestingModule } from '@nestjs/testing';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { mockCredential } from '../../test/mocks/credential.mock';
import { RolesEnum } from 'src/enum/roles.enum';

describe('CredentialController', () => {
  let controller: CredentialController;
  let service: jest.Mocked<CredentialService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredentialController],
      providers: [
        {
          provide: CredentialService,
          useValue: {
            getAllCredentialsService: jest.fn(),
            getCredentialByIdService: jest.fn(),
            getCredentialByUsernameService: jest.fn(),

            // Métodos REALES del service
            putChangeUsernameService: jest.fn(),
            patchChangePasswordService: jest.fn(),
            deleteCredentialService: jest.fn(),
            activateCredentialService: jest.fn(),
            putChangeUserRole: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get(CredentialController);
    service = module.get(CredentialService);
  });

  // ADMIN — Obtener todas las credenciales
  it('debería obtener todas las credenciales', async () => {
    service.getAllCredentialsService.mockResolvedValue([
      mockCredential({ uuid: 'cred-1' }),
    ]);

    const result = await controller.getAllCredentials('');

    expect(service.getAllCredentialsService).toHaveBeenCalled();
    expect(result[0]).toMatchObject({ uuid: 'cred-1' });
  });

  // ADMIN — Obtener una credencial por ID
  it('debería obtener una credencial por su ID', async () => {
    service.getCredentialByIdService.mockResolvedValue(
      mockCredential({ uuid: 'cred-uuid' }),
    );

    const result = await controller.getCredentialById('cred-uuid');

    expect(service.getCredentialByIdService).toHaveBeenCalledWith('cred-uuid');
    expect(result).toMatchObject({ uuid: 'cred-uuid' });
  });

  // USER — Cambiar username
  it('debería cambiar el username', async () => {
    const req = { user: { credential_uuid: 'cred-uuid' } };

    const response = { message: 'Username actualizado' };

    service.putChangeUsernameService.mockResolvedValue(response);

    const result = await controller.putChangeUsername(
      'cred-uuid',
      { username: 'nuevoUser' },
      req,
    );

    expect(service.putChangeUsernameService).toHaveBeenCalledWith(
      'cred-uuid',
      { username: 'nuevoUser' },
      req.user,
    );

    expect(result).toEqual(response);
  });

  // USER — Cambiar password
  it('debería cambiar la contraseña', async () => {
    const req = { user: { credential_uuid: 'cred-uuid' } };
    const response = { message: 'Contraseña modificada' };

    service.patchChangePasswordService.mockResolvedValue(response);

    const result = await controller.patchChangePassword(
      'cred-uuid',
      {
        currentPassword: 'Old123*',
        newPassword: 'New123*',
        confirmNewPassword: 'New123*',
      },
      req,
    );

    expect(service.patchChangePasswordService).toHaveBeenCalledWith(
      'cred-uuid',
      {
        currentPassword: 'Old123*',
        newPassword: 'New123*',
        confirmNewPassword: 'New123*',
      },
      req.user,
    );

    expect(result).toEqual(response);
  });

  // ADMIN — Desactivar
  it('debería desactivar una credencial', async () => {
    const req = { user: { role: 'ADMIN' } };
    const resp = { message: 'Desactivada' };

    service.deleteCredentialService.mockResolvedValue(resp);

    const result = await controller.deleteCredential('cred-uuid', req);

    expect(service.deleteCredentialService).toHaveBeenCalledWith(
      'cred-uuid',
      req.user,
    );

    expect(result).toEqual(resp);
  });

  // ADMIN — Activar
  it('debería activar una credencial', async () => {
    const resp = { message: 'Activada' };

    service.activateCredentialService.mockResolvedValue(resp);

    const result = await controller.activateCredential('cred-uuid');

    expect(service.activateCredentialService).toHaveBeenCalledWith('cred-uuid');
    expect(result).toEqual(resp);
  });

  // ADMIN — Cambiar rol
  it('debería cambiar el rol del usuario', async () => {
    const resp = { message: 'Rol actualizado' };

    service.putChangeUserRole.mockResolvedValue(resp);

    const result = await controller.putChangeUserRole('cred-uuid', {
      role: RolesEnum.ADMIN,
    });

    expect(service.putChangeUserRole).toHaveBeenCalledWith('cred-uuid', {
      role: RolesEnum.ADMIN,
    });

    expect(result).toEqual(resp);
  });
});
