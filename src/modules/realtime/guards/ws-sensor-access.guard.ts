import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { isUUID } from 'class-validator';
import { Socket } from 'socket.io';
import { ICurrentUser } from 'src/modules/auth/interfaces/current-user.interface';
import { SensorService } from 'src/modules/sensor/sensor.service';
import { UserRole } from 'src/modules/user/entities/user.entity';
import { RoomId } from '../helpers/room-id';
import { Sensor } from 'src/modules/sensor/entities/sensor.entity';

@Injectable()
export class WsSensorAccessGuard implements CanActivate {
  constructor(private readonly sensorService: SensorService) {}

  private extractSensorIdFromContext(context: ExecutionContext): string {
    const sensorId = context.switchToWs().getData<string>();

    if (!sensorId || !isUUID(sensorId)) {
      throw new WsException('Invalid sensor ID');
    }

    return sensorId;
  }

  private extractUserFromSocket(socket: Socket): ICurrentUser {
    const user: ICurrentUser = socket.data.user;

    if (!user) {
      throw new WsException('Unauthorized');
    }

    return user;
  }

  private async getSensorById(sensorId: string): Promise<Sensor> {
    const sensor = await this.sensorService.findOne(sensorId);

    if (!sensor) {
      throw new WsException('Sensor not found');
    }

    return sensor;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket: Socket = context.switchToWs().getClient();
    const sensorId = this.extractSensorIdFromContext(context);

    // Check if the socket is already in the room so we can skip the entire check
    if (socket.rooms.has(RoomId.sensor(sensorId))) {
      return true;
    }

    const sensor = await this.getSensorById(sensorId);
    const user = this.extractUserFromSocket(socket);

    switch (user.role) {
      // Allow system admins to access all sensors
      case UserRole.SYSTEM_ADMIN:
        return true;

      // Only allow company admins to access sensors that belong to their company
      case UserRole.COMPANY_ADMIN:
        return sensor.companyId === user.companyId;

      // TODO: Add user-sensor permissions check here
      case UserRole.USER:
        return false;

      default:
        return false;
    }
  }
}
