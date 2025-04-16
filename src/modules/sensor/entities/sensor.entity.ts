import { Company } from 'src/modules/company/entities/company.entity';
import { WithTimestamps } from 'src/modules/database/utils/with-timestamps';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// This could be extended with type etc.
@Entity('sensors')
export class Sensor extends WithTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', nullable: true })
  companyId: string;

  @JoinColumn({ name: 'company_id' })
  @ManyToOne(() => Company, (company) => company.sensors, {
    onDelete: 'SET NULL',
  })
  company: Company;
}
