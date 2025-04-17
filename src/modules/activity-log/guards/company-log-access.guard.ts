import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ICurrentUser } from 'src/modules/auth/interfaces/current-user.interface';
import { UserRole } from 'src/modules/user/entities/user.entity';

@Injectable()
export class CompanyLogAccessGuard implements CanActivate {
  /**
   * Extracts target company ID from the request parameters or current user.
   * @param request
   * @returns companyId
   * @throws BadRequestException if company ID is not found in request parameters or user.
   */
  private extractTargetCompanyId(request: any): string {
    const companyId = request.params.companyId ?? request.user.companyId;

    if (!companyId) {
      throw new BadRequestException(
        'Company ID is required in the request parameters.',
      );
    }

    return companyId;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const targetCompanyId = this.extractTargetCompanyId(request);
    const currentUser: ICurrentUser = request.user;

    switch (currentUser.role) {
      // Allow system admins to access any logs
      case UserRole.SYSTEM_ADMIN:
        return true;

      // Allow company admins to access logs of their own company
      case UserRole.COMPANY_ADMIN:
        return currentUser.companyId === targetCompanyId;

      // Deny access for regular users
      default:
        return false;
    }
  }
}
