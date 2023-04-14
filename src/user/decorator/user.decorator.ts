import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../models/User';

export const UserDecorator = createParamDecorator(
  (data: any, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) return null;

    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
