import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IAccessTokenGenerator } from 'src/common/access-token-generator/access-token-generator.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly accessTokenGenerator: IAccessTokenGenerator) {}

  async canActivate(_: ExecutionContext): Promise<boolean> {
    return true;
  }
}
