import { Credential } from 'src/entities/credential.entity';
import { RolesEnum } from 'src/enum/roles.enum';
import { User } from 'src/entities/user.entity';

export const mockUser = (overrides?: Partial<User>): User => ({
  uuid: 'user-uuid',
  name: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '12345',
  address: 'Fake street',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  credential: undefined!,
  carts: [],
  orders: [],
  ...overrides,
});

export const mockCredential = (overrides?: Partial<Credential>): Credential => {
  const user = mockUser();

  const credential: Credential = {
    uuid: 'cred-uuid',
    username: 'john',
    password: 'hashed123',
    role: RolesEnum.USER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    user,
    ...overrides,
  };

  user.credential = credential;

  return credential;
};
