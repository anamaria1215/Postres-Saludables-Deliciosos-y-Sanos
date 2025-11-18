import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserDto } from './Dtos/updateUser.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    getAllUsersService: jest.fn(),
    getUserByNameService: jest.fn(),
    getUserByNameAndLastNameService: jest.fn(),
    getUserByIdService: jest.fn(),
    getUserProfileService: jest.fn(),
    putUpdateUserProfileService: jest.fn(),
  };

  const mockGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('debería llamar a getUserByNameAndLastNameService si vienen name y lastName', () => {
      mockUserService.getUserByNameAndLastNameService.mockReturnValue(['user1']);
      const result = controller.getAllUsers('John', 'Doe');
      expect(service.getUserByNameAndLastNameService).toHaveBeenCalledWith('John', 'Doe');
      expect(result).toEqual(['user1']);
    });

    it('debería llamar a getUserByNameService si solo viene name', () => {
      mockUserService.getUserByNameService.mockReturnValue(['user2']);
      const result = controller.getAllUsers('Jane');
      expect(service.getUserByNameService).toHaveBeenCalledWith('Jane');
      expect(result).toEqual(['user2']);
    });

    it('debería llamar a getAllUsersService si no vienen parámetros', () => {
      mockUserService.getAllUsersService.mockReturnValue(['user3']);
      const result = controller.getAllUsers();
      expect(service.getAllUsersService).toHaveBeenCalled();
      expect(result).toEqual(['user3']);
    });
  });

  describe('getUserById', () => {
    it('debería llamar a getUserByIdService con uuid', () => {
      mockUserService.getUserByIdService.mockReturnValue({ id: 'uuid' });
      const result = controller.getUserById('uuid');
      expect(service.getUserByIdService).toHaveBeenCalledWith('uuid');
      expect(result).toEqual({ id: 'uuid' });
    });
  });

  describe('getUserProfile', () => {
    it('debería llamar a getUserProfileService con req', () => {
      const req = { user: { id: 1 } };
      mockUserService.getUserProfileService.mockReturnValue({ id: 1 });
      const result = controller.getUserProfile(req);
      expect(service.getUserProfileService).toHaveBeenCalledWith(req);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('putUpdateUserProfile', () => {
    it('debería llamar a putUpdateUserProfileService con req y dto', () => {
      const req = { user: { id: 1 } };
      const dto: UpdateUserDto = { name: 'NewName' } as UpdateUserDto;
      mockUserService.putUpdateUserProfileService.mockReturnValue({ id: 1, ...dto });

      const result = controller.putUpdateUserProfile(req, dto);
      expect(service.putUpdateUserProfileService).toHaveBeenCalledWith(req, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });
});
