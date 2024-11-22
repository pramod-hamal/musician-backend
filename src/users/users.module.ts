import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './user.repository';
import { PasswordHashModule } from 'src/common/password-hash/password-hash.module';
import { UserFactoryService } from './user.factory.service';
import { ArtistCsvModule } from './csv-module/artist-csv.module';

@Global()
@Module({
  imports: [PasswordHashModule, ArtistCsvModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserFactoryService],
  exports: [UsersService, UsersRepository, UserFactoryService],
})
export class UsersModule {}
