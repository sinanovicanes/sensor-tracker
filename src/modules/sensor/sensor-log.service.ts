import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSensorLogDto } from './dtos/create-sensor-log.dto';
import { SensorLog } from './entities/sensor-log.entity';

@Injectable()
export class SensorLogService {
  constructor(
    @InjectRepository(SensorLog)
    private readonly sensorLogRepo: Repository<SensorLog>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateSensorLogDto): Promise<SensorLog> {
    const sensorLog = this.sensorLogRepo.create(dto);
    const savedSensorLog = await this.sensorLogRepo.save(sensorLog);

    this.eventEmitter.emit('sensor.log.created', savedSensorLog);

    return savedSensorLog;
  }

  async findAll(): Promise<SensorLog[]> {
    return this.sensorLogRepo.find();
  }

  async findOne(id: string): Promise<SensorLog | null> {
    return this.sensorLogRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    const result = await this.sensorLogRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Sensor log with id ${id} not found`);
    }

    this.eventEmitter.emit('sensor.log.deleted', id);
  }
}
