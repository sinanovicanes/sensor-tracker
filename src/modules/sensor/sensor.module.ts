import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './entities/sensor.entity';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  providers: [SensorService],
  controllers: [SensorController],
})
export class SensorModule {}
