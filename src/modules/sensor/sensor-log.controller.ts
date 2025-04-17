import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { LogActivity } from '../activity-log/decorators/log-activity.decorator';
import { ActivityAction } from '../activity-log/entities/activity-log.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { SensorAccessGuard } from './guards/sensor-access.guard';
import { SensorLogService } from './sensor-log.service';

@UseGuards(SensorAccessGuard)
@Controller('sensors/:sensorId/logs')
export class SensorLogController {
  constructor(private readonly sensorLogService: SensorLogService) {}

  @LogActivity(ActivityAction.VIEW_LOGS)
  @Get()
  findAll() {
    return this.sensorLogService.findAll();
  }

  @Get(':logId')
  findOne(@Param('logId', ParseUUIDPipe) logId: string) {
    return this.sensorLogService.findOne(logId);
  }

  @Delete(':logId')
  @Roles(UserRole.SYSTEM_ADMIN)
  remove(@Param('logId', ParseUUIDPipe) logId: string) {
    return this.sensorLogService.remove(logId);
  }
}
