import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/credential/DTOs/sing-up.dto';
import { LoginDto } from 'src/credential/DTOs/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signUpService: jest.fn(),
    signInService: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('debería llamar a signUpService y devolver el resultado', async () => {
    const dto: SignUpDto = { email: 'test@test.com', password: '123456' } as any;
    const result = { id: 1, email: 'test@test.com' };

    mockAuthService.signUpService.mockResolvedValue(result);

    expect(await controller.signUp(dto)).toEqual(result);
    expect(service.signUpService).toHaveBeenCalledWith(dto);
  });

  it('debería llamar a signInService y devolver el resultado', async () => {
    const dto: LoginDto = { email: 'test@test.com', password: '123456' } as any;
    const result = { access_token: 'jwt-token' };

    mockAuthService.signInService.mockResolvedValue(result);

    expect(await controller.signIn(dto)).toEqual(result);
    expect(service.signInService).toHaveBeenCalledWith(dto);
  });
});
