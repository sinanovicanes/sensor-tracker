import { UserRole } from 'src/modules/user/entities/user.entity';

export interface ICurrentUser {
  id: string;
  email: string;
  companyId?: string;
  role: UserRole;
}
