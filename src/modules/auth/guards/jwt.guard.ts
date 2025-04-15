import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { ICurrentUser } from '../interfaces/current-user.interface';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly reflector = new Reflector();

  constructor(private readonly jwtService: JwtService) {}

  private extractTokenFromRequest(request: Request): string {
    try {
      const [bearer, token] = (request.headers.authorization as string).split(
        ' ',
      );

      if (bearer !== 'Bearer' || !token) {
        // Go to catch block
        throw new Error('Invalid token format');
      }

      return token;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private validateRoles(ctx: ExecutionContext, user: ICurrentUser) {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!roles || roles.includes(user.role)) return;

    throw new UnauthorizedException();
  }

  private async authenticateJwtToken(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    try {
      const payload: IJwtPayload = await this.jwtService.verifyAsync(token);

      request.user = {
        id: payload.sub,
        companyId: payload.companyId,
        email: payload.email,
        role: payload.role,
      } as ICurrentUser;
    } catch (e) {
      throw new UnauthorizedException();
    }

    this.validateRoles(ctx, request.user);

    return true;
  }

  private isPublic(ctx: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
  }

  canActivate(ctx: ExecutionContext): Promise<boolean> | boolean {
    const isPublic = this.isPublic(ctx);

    if (isPublic) return true;

    return this.authenticateJwtToken(ctx);
  }
}
