import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './user.repository';
import { PasswordHashModule } from 'src/common/password-hash/password-hash.module';
import { UserFactoryService } from './user.factory.service';

@Global()
@Module({
  imports: [PasswordHashModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserFactoryService],
  exports: [UsersService, UsersRepository, UserFactoryService],
})
export class UsersModule {}
