import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAccessTokenGenerator } from './access-token-generator.interface';

@Injectable()
export class JwtTokenService implements IAccessTokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  async generate(userId: string): Promise<string> {
    return await this.jwtService.signAsync({ userId });
  }

  async decode(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }
}
