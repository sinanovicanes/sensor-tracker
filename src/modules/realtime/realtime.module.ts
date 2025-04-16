import { Module } from '@nestjs/common';
import { SensorEventsGateway } from './gateways/sensor-events.gateway';
import { AuthModule } from '../auth/auth.module';
import { SensorModule } from '../sensor/sensor.module';

@Module({
  imports: [AuthModule, SensorModule],
  providers: [SensorEventsGateway],
})
export class RealtimeModule {}
