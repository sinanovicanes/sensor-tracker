import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { ICurrentUser } from 'src/modules/auth/interfaces/current-user.interface';
import { ActivityLogService } from '../activity-log.service';
import { ACTIVITY_ACTION_KEY } from '../decorators/log-activity.decorator';
import { ActivityAction } from '../entities/activity-log.entity';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ActivityLogInterceptor.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly activityLogService: ActivityLogService,
  ) {}

  private extractActivityAction(
    context: ExecutionContext,
  ): ActivityAction | null {
    const action = this.reflector.getAllAndOverride<ActivityAction | null>(
      ACTIVITY_ACTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    return action ?? null;
  }

  private extractUser(context: ExecutionContext): ICurrentUser | null {
    const request = context.switchToHttp().getRequest();
    const user: ICurrentUser = request.user;

    return user ?? null;
  }

  private logActivity(context: ExecutionContext) {
    const action = this.extractActivityAction(context);

    if (!action) {
      this.logger.warn('No activity action found in execution context');
      return;
    }

    const user = this.extractUser(context);

    if (!user) {
      this.logger.warn('No user found in request context');
      return;
    }

    this.activityLogService.create({
      action,
      userId: user.id,
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        this.logActivity(context);
      }),
    );
  }
}
