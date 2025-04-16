import { WithTimestamps } from 'src/modules/database/utils/with-timestamps';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sensor } from './sensor.entity';

@Entity('sensor_logs')
export class SensorLog extends WithTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sensor_id' })
  sensorId: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'jsonb' })
  data: Record<string, unknown>;

  @JoinColumn({ name: 'sensor_id' })
  @ManyToOne(() => Sensor, (sensor) => sensor.logs, {
    onDelete: 'CASCADE',
  })
  sensor: Sensor;
}
