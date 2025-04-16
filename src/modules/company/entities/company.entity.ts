import { WithTimestamps } from 'src/modules/database/utils/with-timestamps';
import { Sensor } from 'src/modules/sensor/entities/sensor.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('companies')
export class Company extends WithTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Sensor, (sensor) => sensor.company)
  sensors: Sensor[];
}
