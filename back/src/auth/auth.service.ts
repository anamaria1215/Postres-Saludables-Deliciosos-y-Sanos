import { 
  ConflictException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'src/credential/DTOs/sing-up.dto';
import { UserRepository } from 'src/user/user.repository';
import { CredentialRepository } from 'src/credential/credential.repository';
import { LoginDto } from 'src/credential/DTOs/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly credentialRepository: CredentialRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  //Registar usuarios (con contraseñas hasheadas)
  async signUpService(signUpDto: SignUpDto) { 

    //Credenciales

    const { createCredentialDto, createUserDto } = signUpDto;
    //Verificar si el username ya existe
    const usernameExists = await this.credentialRepository.getCredentialByUsernameRepository(
      createCredentialDto.username
    );
    if (usernameExists) {
      throw new ConflictException('Este nombre de usuario ya se encuentra en uso.');
    }
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(createCredentialDto.password, 10);
    
    const newCredential = await this.credentialRepository.postCreateCredentialRepository({
      username: createCredentialDto.username,
      password: hashedPassword,
    });
    
    //Perfil de usuario

    //Verificar si el correo ya existe
    const emailExists = await this.userRepository.getUserByEmailRepository(
      createUserDto.email
    );
    if (emailExists) {
      throw new ConflictException('Este correo ya se encuentra en uso.');
    }
   
    const newUser = await this.userRepository.postCreateUserRepository({
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      address: createUserDto.address,
      credential: newCredential,
    });
    
    // Eliminar la contraseña antes de retornar
    const { password, ...credentialWithoutPassword } = newCredential;
    // Quitar credential anidada del perfil en el retorno
    const userWithoutCredential = { ...newUser };
    delete (userWithoutCredential as any).credential;

    console.log(`Usuario ${credentialWithoutPassword.username} registrado existosamente.`);
    return {
      message: `Usuario ${credentialWithoutPassword.username} registrado exitosamente.`,
      credential: credentialWithoutPassword,
      profile: userWithoutCredential,
    };
  }

  //Iniciar sesión y validar las credenciales (login)
  async signInService(loginDto: LoginDto) {
    const { username, password } = loginDto;
    //Verificar si existe el usuario)
    const credentialExists = await this.credentialRepository.getCredentialByUsernameRepository(username)

    if (!credentialExists) {
      throw new NotFoundException('Credenciales inválidas.');
    }

    //Verificar la contraseña
    const validatePassword = await bcrypt.compare(
      password,
      credentialExists.password,
    );
    if (!validatePassword) {
      throw new NotFoundException('Credenciales inválidas.');
    }
    //Verificar si el usuario está activo
    if (credentialExists.isActive === false) {
      throw new ConflictException(
        'El usuario está inactivo. Comuníquese con el administrador.',
      );
    }
    //Crear la información que va dentro del token
    const payload = {
      credential_uuid: credentialExists.uuid, //Necesario en algunas rutas
      user_uuid: credentialExists.user.uuid, //Necesario en algunas rutas
      username: credentialExists.username,
      role: credentialExists.role,
    };
    //Generar el JWT
    const token = this.jwtService.sign(payload);

    console.log('Inicio de sesión exitoso.')
    return {
      message: 'Inicio de sesión exitoso.',
      access_token: token,
      expires_in: process.env.JWT_EXPIRES_IN,
    };
  }
}