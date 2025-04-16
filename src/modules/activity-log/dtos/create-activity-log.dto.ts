import { IsEnum, IsUUID } from 'class-validator';
import { ActivityAction } from '../entities/activity-log.entity';

export class CreateActivityLogDto {
  @IsUUID()
  userId: string;

  @IsEnum(ActivityAction)
  action: ActivityAction;
}
