import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { ICurrentUser } from '../interfaces/current-user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof ICurrentUser, ctx: ExecutionContext) => {
    const user: ICurrentUser | null = ctx.switchToHttp().getRequest().user;

    if (!user) {
      throw new UnauthorizedException();
    }

    return data ? user[data] : user;
  },
);
