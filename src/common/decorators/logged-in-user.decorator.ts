import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

const getcurrentUserByContext = (context: ExecutionContext): UserEntity => {
  const request = context.switchToHttp().getRequest();
  return request.user;
};

export const LoggedInUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getcurrentUserByContext(context),
);
