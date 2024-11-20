import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { IAccessTokenGenerator } from './access-token-generator.interface';
import { JwtTokenService } from './access-token-generator.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: 'test secret for it',
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  providers: [
    {
      provide: IAccessTokenGenerator,
      useClass: JwtTokenService,
    },
  ],
  exports: [IAccessTokenGenerator],
})
export class AccessTokenGeneratorModule {}
