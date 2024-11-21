import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import AppException from 'src/common/error/app.exception';
import { UserRoleEnum } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const isAllowed = requiredRoles.includes(request.user.role);
    if (!isAllowed) {
      throw new AppException({}, 'Forbidden Exception', 403);
    }
    return isAllowed;
  }
}
