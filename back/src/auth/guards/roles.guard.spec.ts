import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesEnum } from 'src/enum/roles.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
    guard = new RolesGuard(reflector);
  });

  const mockContext = (user?: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  it('debería permitir acceso si el usuario tiene el rol requerido', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([RolesEnum.ADMIN]);

    const context = mockContext({ role: 'ADMIN' });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('debería lanzar ForbiddenException si el usuario no tiene el rol requerido', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([RolesEnum.ADMIN]);

    const context = mockContext({ role: 'USER' });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('debería lanzar ForbiddenException si no hay usuario en el request', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([RolesEnum.ADMIN]);

    const context = mockContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('debería permitir acceso si no hay roles requeridos', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    const context = mockContext({ role: 'USER' });
    // En este caso, como no hay roles definidos, el guard debería devolver true
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });
});
