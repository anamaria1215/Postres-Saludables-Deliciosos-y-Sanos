import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = {
      verify: jest.fn(),
    } as any;
    guard = new JwtAuthGuard(jwtService);
    process.env.JWT_SECRET = 'test_secret';
  });

  const mockContext = (authHeader?: string): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: authHeader ? { authorization: authHeader } : {},
        }),
      }),
    } as any;
  };

  it('debería lanzar Unauthorized si no hay header', () => {
    expect(() => guard.canActivate(mockContext())).toThrow(UnauthorizedException);
  });

  it('debería lanzar Unauthorized si el token no está en formato Bearer', () => {
    expect(() => guard.canActivate(mockContext('token'))).toThrow(UnauthorizedException);
  });

  it('debería lanzar BadRequest si no hay secreto', () => {
    delete process.env.JWT_SECRET;
    expect(() => guard.canActivate(mockContext('Bearer token'))).toThrow(BadRequestException);
  });

  it('debería permitir acceso si el token es válido y tiene rol', () => {
    (jwtService.verify as jest.Mock).mockReturnValue({ role: 'admin', exp: 123456, iat: 123456 });
    const result = guard.canActivate(mockContext('Bearer validtoken'));
    expect(result).toBe(true);
  });

  it('debería lanzar Unauthorized si el payload no tiene rol', () => {
    (jwtService.verify as jest.Mock).mockReturnValue({ exp: 123456, iat: 123456 });
    expect(() => guard.canActivate(mockContext('Bearer validtoken'))).toThrow(UnauthorizedException);
  });
});
