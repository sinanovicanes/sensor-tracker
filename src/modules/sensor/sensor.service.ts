import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { UpdateSensorDto } from './dtos/update-sensor.dto';
import { Sensor } from './entities/sensor.entity';

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(Sensor) private readonly sensorRepo: Repository<Sensor>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateSensorDto): Promise<Sensor> {
    const sensor = this.sensorRepo.create(dto);
    const savedSensor = await this.sensorRepo.save(sensor);

    this.eventEmitter.emit('sensor.created', savedSensor);

    return savedSensor;
  }

  async findAll(): Promise<Sensor[]> {
    return this.sensorRepo.find();
  }

  async findOne(id: string): Promise<Sensor | null> {
    return this.sensorRepo.findOneBy({ id });
  }

  async update(id: string, dto: UpdateSensorDto): Promise<Sensor | null> {
    const result = await this.sensorRepo.update(id, dto);

    if (result.affected === 0) {
      throw new NotFoundException(`Sensor with id ${id} not found`);
    }

    const updatedSensor = await this.findOne(id);

    if (!!updatedSensor) {
      this.eventEmitter.emit('sensor.updated', updatedSensor);
    }

    return updatedSensor;
  }

  async remove(id: string): Promise<void> {
    const result = await this.sensorRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Sensor with id ${id} not found`);
    }

    this.eventEmitter.emit('sensor.deleted', id);
  }
}
