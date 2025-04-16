import { IsUUID } from 'class-validator';

export class CreateSensorDto {
  @IsUUID()
  companyId: string;
}
