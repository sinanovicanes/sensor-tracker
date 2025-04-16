import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsUUID } from 'class-validator';

export class CreateSensorLogDto {
  @IsUUID()
  sensorId: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  timestamp: Date;

  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;
}
