import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ActivityLogController } from './activity-log.controller';
import { ActivityLogService } from './activity-log.service';
import { ActivityLog } from './entities/activity-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog]), UserModule],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
  controllers: [ActivityLogController],
})
export class ActivityLogModule {}
