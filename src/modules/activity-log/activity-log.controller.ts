import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ActivityLogService } from './activity-log.service';
import { CompanyLogAccessGuard } from './guards/company-log-access.guard';
import { UserLogAccessGuard } from './guards/user-log-access.guard';

@Controller()
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Roles(UserRole.SYSTEM_ADMIN)
  @Get('activity-logs')
  findAll() {
    return this.activityLogService.findAll();
  }

  @Roles(UserRole.SYSTEM_ADMIN, UserRole.COMPANY_ADMIN)
  @UseGuards(UserLogAccessGuard)
  @Get('users/:targetUserId/activity-logs')
  getUserActivityLogs(
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string,
  ) {
    return this.activityLogService.findAll({ userId: targetUserId });
  }

  @Roles(UserRole.SYSTEM_ADMIN, UserRole.COMPANY_ADMIN)
  @UseGuards(CompanyLogAccessGuard)
  @Get('companies/:companyId/activity-logs')
  getCompanyActivityLogs(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return this.activityLogService.findAll({ companyId });
  }
}
