import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
//import { Credential } from '../entities/credential.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Credential])],
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}