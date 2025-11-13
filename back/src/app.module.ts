
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, InitialDataLoader } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Configuración de TypeORM
import typeorm from './config/typeorm';

// Módulos funcionales
import { PaymentModule } from './payment/payment.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrderModule } from './order/order.module';
import { OrderDetailModule } from './orderDetail/orderDetail.module';
import { CartModule } from './cart/cart.module';

// Módulos de autenticación y usuarios
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CredentialModule } from './credential/credential.module';

//Entidades usadas por la precarga
import { User } from './entities/user.entity';
import { Credential } from './entities/credential.entity';
import { Category } from './entities/category.entity';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Configuración global
   ConfigModule.forRoot({
     isGlobal: true,
     envFilePath: '.env.development', // Usa el mismo nombre que tu archivo
     load: [typeorm],
}),


    // Conexión con la base de datos
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm') ?? {},
    }),

    // Repositorios necesarios para el InitialDataLoader
    TypeOrmModule.forFeature([
      User, 
      Credential,
      Category, 
    ]),

    // Módulo JWT global (usado en AuthService, guards, etc.)
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600, // 1 hora en segundos
      },
    }),

    // Módulos propios del sistema
    PaymentModule,
    CategoriesModule,
    ProductsModule,
    OrderModule,
    OrderDetailModule,
    CartModule,

    // Autenticación y gestión de usuarios
    AuthModule,
    UserModule,
    CredentialModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, InitialDataLoader],
})
export class AppModule {}
