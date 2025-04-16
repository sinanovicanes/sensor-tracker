import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityLogDto } from './dtos/create-activity-log.dto';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateActivityLogDto): Promise<ActivityLog> {
    const activityLog = this.activityLogRepo.create(dto);
    const savedActivityLog = await this.activityLogRepo.save(activityLog);

    this.eventEmitter.emit('activity-log.created', savedActivityLog);

    return savedActivityLog;
  }
}
