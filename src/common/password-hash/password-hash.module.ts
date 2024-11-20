import { Module } from '@nestjs/common';
import { BcryptPasswordHashService } from './bcrypt-password-hash.service';
import { IPasswordHashService } from './password-hash.interface';

@Module({
  providers: [
    {
      provide: IPasswordHashService,
      useClass: BcryptPasswordHashService,
    },
  ],
  exports: [IPasswordHashService],
})
export class PasswordHashModule {}
