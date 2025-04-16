import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { SensorLogService } from './sensor-log.service';

// TODO: Add sensor access guard
@Controller('sensors/:sensorId/logs')
export class SensorLogController {
  constructor(private readonly sensorLogService: SensorLogService) {}

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN)
  findAll() {
    return this.sensorLogService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sensorLogService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sensorLogService.remove(id);
  }
}
