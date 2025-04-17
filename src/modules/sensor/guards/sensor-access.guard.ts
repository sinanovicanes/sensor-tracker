import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ICurrentUser } from 'src/modules/auth/interfaces/current-user.interface';
import { UserRole } from 'src/modules/user/entities/user.entity';
import { Sensor } from '../entities/sensor.entity';
import { SensorService } from '../sensor.service';

@Injectable()
export class SensorAccessGuard implements CanActivate {
  constructor(private readonly sensorService: SensorService) {}

  private extractSensorId(request: Request): string {
    const sensorId = request.params.sensorId;

    if (!sensorId) {
      throw new BadRequestException(
        'Sensor ID is required in the request parameters.',
      );
    }

    return sensorId;
  }

  private async getSensorByRequest(request: Request): Promise<Sensor> {
    const sensorId = this.extractSensorId(request);
    const sensor = await this.sensorService.findOne(sensorId);

    if (!sensor) {
      throw new UnauthorizedException();
    }

    return sensor;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sensor = await this.getSensorByRequest(request);
    const currentUser: ICurrentUser = request.user;

    switch (currentUser.role) {
      case UserRole.SYSTEM_ADMIN:
        return true;
      case UserRole.COMPANY_ADMIN:
        return sensor.companyId === currentUser.companyId;
      case UserRole.USER:
        // TODO: Implement user access logic
        return false;
      default:
        return false;
    }
  }
}
