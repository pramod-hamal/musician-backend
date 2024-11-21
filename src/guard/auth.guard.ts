import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IAccessTokenGenerator } from 'src/common/access-token-generator/access-token-generator.interface';
import AppException from 'src/common/error/app.exception';
import { RequestWithUser } from 'src/common/type/request-with-user';
import { UsersRepository } from 'src/users/user.repository';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly accessTokenGenerator: IAccessTokenGenerator,
    private readonly userRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = await this.extractTokenFromHeader(request);
    if (!token) {
      throw new AppException({}, 'Unauthorized', 401);
    }

    const decoded = await this.accessTokenGenerator.decode(token);
    if (!decoded) {
      throw new AppException({}, 'Unauthorized', 401);
    }

    const user = await this.userRepository.findOne({ id: decoded.userId });
    if (!user) {
      throw new AppException({}, 'Unauthorized', 401);
    }
    request.user = user;
    return true;
  }

  async extractTokenFromHeader(request: RequestWithUser): Promise<string> {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
