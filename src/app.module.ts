import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGeneratorModule } from './common/access-token-generator/access-token-generator.module';
import { DatabaseModule } from './common/database/database.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { JwtAuthGuard } from './guard/auth.guard';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, AccessTokenGeneratorModule, UsersModule],
  providers: [
    JwtAuthGuard,
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
