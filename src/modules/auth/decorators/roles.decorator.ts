import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/user/entities/user.entity';

export const ROLES_KEY = Symbol('roles');
export const Roles = (...args: UserRole[]) => SetMetadata(ROLES_KEY, args);
