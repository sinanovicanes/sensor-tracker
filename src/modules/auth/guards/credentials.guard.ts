import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { UserCredentialsDto } from '../dtos/user-credentials.dto';
import { ICurrentUser } from '../interfaces/current-user.interface';

@Injectable()
export class CredentialsGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  private getCredentialsFromRequest(request: Request): UserCredentialsDto {
    const { email, password } = request.body;

    if (!email || !password) {
      throw new BadRequestException();
    }

    return { email, password };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const credentials = this.getCredentialsFromRequest(request);

    const user = await this.authService.validateByCredentials(credentials);

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = {
      email: user.email,
      id: user.id,
      role: user.role,
    } as ICurrentUser;

    return true;
  }
}
