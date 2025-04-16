import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsUUID()
  companyId: string;

  @IsEnum(UserRole)
  role: UserRole;
}
