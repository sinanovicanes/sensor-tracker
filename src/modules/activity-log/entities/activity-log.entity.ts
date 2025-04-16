import { WithTimestamps } from 'src/modules/database/utils/with-timestamps';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum ActivityAction {
  VIEW_LOGS = 'viewed_logs',
}

@Entity('activity_logs')
export class ActivityLog extends WithTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: ActivityAction })
  action: ActivityAction;

  @ManyToOne(() => User, (user) => user.activityLogs, {
    onDelete: 'CASCADE',
  })
  user: User;
}
