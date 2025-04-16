import { Exclude } from 'class-transformer';
import { ActivityLog } from 'src/modules/activity-log/entities/activity-log.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { WithTimestamps } from 'src/modules/database/utils/with-timestamps';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  COMPANY_ADMIN = 'company_admin',
  USER = 'user',
}

@Entity('users')
export class User extends WithTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ name: 'company_id', nullable: true })
  companyId: string;

  @JoinColumn({ name: 'company_id' })
  @ManyToOne(() => Company, (company) => company.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  company: Company;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.user)
  activityLogs: ActivityLog[];
}
