import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorLog } from './entities/sensor-log.entity';
import { Sensor } from './entities/sensor.entity';
import { MqttSensorController } from './mqtt-sensor.controller';
import { SensorLogController } from './sensor-log.controller';
import { SensorLogService } from './sensor-log.service';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, SensorLog])],
  providers: [SensorService, SensorLogService],
  controllers: [SensorController, SensorLogController, MqttSensorController],
  exports: [SensorService],
})
export class SensorModule {}
