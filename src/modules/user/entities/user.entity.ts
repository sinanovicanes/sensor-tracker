import { WithTimestamps } from 'src/modules/database/utils/with-timestamps';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  COMPANY_ADMIN = 'company_admin',
  USER = 'user',
}

@Entity('users')
export class User extends WithTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  // TODO: Add relations with other entitites like company, permissions etc.
}
