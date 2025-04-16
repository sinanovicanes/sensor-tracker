import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ICurrentUser } from 'src/modules/auth/interfaces/current-user.interface';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  private extractCompanyIdFromRequest(request: Request): string {
    const companyId =
      request.params.companyId ??
      request.body.companyId ??
      request.query.companyId ??
      request.headers['x-company-id'];

    if (!companyId || typeof companyId !== 'string') {
      throw new BadRequestException('Invalid company ID provided.');
    }

    return companyId;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: ICurrentUser = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    // SYSTEM_ADMIN has access to all companies
    if (user.role === UserRole.SYSTEM_ADMIN) {
      return true;
    }

    const companyId = this.extractCompanyIdFromRequest(request);

    // Only allow access if the user is associated with the company
    return user.companyId === companyId;
  }
}
