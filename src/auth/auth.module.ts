import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PasswordHashModule } from 'src/common/password-hash/password-hash.module';
import { AccessTokenGeneratorModule } from 'src/common/access-token-generator/access-token-generator.module';

@Module({
  imports: [UsersModule, PasswordHashModule, AccessTokenGeneratorModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
