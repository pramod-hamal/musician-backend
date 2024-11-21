import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGeneratorModule } from './common/access-token-generator/access-token-generator.module';
import { DatabaseModule } from './common/database/database.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { JwtAuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/role.guard';
import { UsersModule } from './users/users.module';
import { MusicModule } from './music/music.module';

@Module({
  imports: [
    DatabaseModule,
    AccessTokenGeneratorModule,
    UsersModule,
    AuthModule,
    MusicModule,
  ],
  providers: [
    JwtAuthGuard,
    RolesGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
