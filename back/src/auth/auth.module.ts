import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CredentialModule } from 'src/credential/credential.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CredentialModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}