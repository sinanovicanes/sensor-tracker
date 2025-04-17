import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityLogDto } from './dtos/create-activity-log.dto';
import { ActivityAction, ActivityLog } from './entities/activity-log.entity';

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

  async findAll(
    filters: {
      userId?: string;
      action?: ActivityAction;
      companyId?: string;
    } = {},
  ): Promise<ActivityLog[]> {
    const query = this.activityLogRepo
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user');

    if (filters.userId)
      query.andWhere('log.userId = :userId', { userId: filters.userId });
    if (filters.action)
      query.andWhere('log.action = :action', { action: filters.action });
    if (filters.companyId)
      query.andWhere('user.companyId = :companyId', {
        companyId: filters.companyId,
      });

    return await query.orderBy('log.createdAt', 'DESC').getMany();
  }
}
