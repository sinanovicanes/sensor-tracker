import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateSensorLogDto } from './dtos/create-sensor-log.dto';
import { SensorLogService } from './sensor-log.service';

@Controller()
export class MqttSensorController {
  private readonly logger = new Logger(MqttSensorController.name);

  constructor(private readonly sensorLogService: SensorLogService) {}

  @EventPattern('sensor/log')
  async onLogReceived(@Payload() dto: CreateSensorLogDto) {
    this.logger.log('Received sensor log', dto);

    try {
      await this.sensorLogService.create(dto);
      this.logger.log('Sensor log saved', dto);
    } catch (e) {
      this.logger.error('Failed to save sensor log', e);
    }
  }
}
