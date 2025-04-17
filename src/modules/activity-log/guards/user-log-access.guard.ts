import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ICurrentUser } from 'src/modules/auth/interfaces/current-user.interface';
import { User, UserRole } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class UserLogAccessGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  private extractTargetUserId(request: Request): string {
    const userId = request.params.targetUserId;

    if (!userId) {
      throw new BadRequestException(
        'User ID is required in the request parameters.',
      );
    }

    return userId;
  }

  private async getTargetUser(request: Request): Promise<User> {
    const userId = this.extractTargetUserId(request);
    const targetUser = await this.userService.findOne(userId);

    if (!targetUser) {
      // This could be not found but do we want to expose that?
      throw new UnauthorizedException();
    }

    return targetUser;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const targetUser = await this.getTargetUser(request);
    const currentUser: ICurrentUser = request.user;

    if (!targetUser) return false;

    switch (currentUser.role) {
      // Allow system admins to access any user's logs
      case UserRole.SYSTEM_ADMIN:
        return true;

      // Allow company admins to access logs of users in the same company
      case UserRole.COMPANY_ADMIN:
        return currentUser.companyId === targetUser.companyId;

      // Deny access for regular users
      default:
        return false;
    }
  }
}
