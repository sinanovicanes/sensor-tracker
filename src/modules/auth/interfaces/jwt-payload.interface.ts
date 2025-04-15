import { UserRole } from 'src/modules/user/entities/user.entity';

export interface IJwtPayload {
  sub: string;
  email: string;
  companyId?: string;
  role: UserRole;
}
