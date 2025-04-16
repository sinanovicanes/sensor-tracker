import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ActivityAction } from '../entities/activity-log.entity';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';

export const ACTIVITY_ACTION_KEY = Symbol('ACTIVITY_ACTION');
export const LogActivity = (action: ActivityAction) =>
  applyDecorators(
    SetMetadata(ACTIVITY_ACTION_KEY, action),
    UseInterceptors(ActivityLogInterceptor),
  );
