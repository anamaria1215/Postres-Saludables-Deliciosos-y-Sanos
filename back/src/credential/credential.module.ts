import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from '../entities/credential.entity';
import { CredentialRepository } from './credential.repository';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Credential])],
  controllers: [CredentialController],
  providers: [CredentialService, CredentialRepository],
  exports: [CredentialService, CredentialRepository],
})
export class CredentialModule {}
