import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SensorLog } from 'src/modules/sensor/entities/sensor-log.entity';
import { RoomId } from '../helpers/room-id';
import { WsAuthMiddlewareFactory } from '../middlewares/ws-auth.middleware';

@WebSocketGateway({ namespace: 'sensor-events', cors: true })
export class SensorEventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(SensorEventsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    // Only allow authenticated users to connect to the WebSocket server
    server.use(WsAuthMiddlewareFactory.create(this.jwtService));
  }

  handleConnection(socket: Socket) {
    this.logger.log(
      `Client connected: ${socket.id} | User ID: ${socket.data.user.id}`,
    );
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(
      `Client disconnected: ${socket.id} | User ID: ${socket.data.user.id}`,
    );
  }

  @SubscribeMessage('sensor.subscribe')
  subscribeToSensor(
    @ConnectedSocket() socket: Socket,
    @MessageBody() sensorId: string,
  ) {
    socket.join(RoomId.sensor(sensorId));
    this.logger.log(`Client ${socket.id} subscribed to sensor ${sensorId}`);
  }

  @SubscribeMessage('sensor.unsubscribe')
  unsubscribeFromSensor(
    @ConnectedSocket() socket: Socket,
    @MessageBody() sensorId: string,
  ) {
    socket.leave(RoomId.sensor(sensorId));
    this.logger.log(`Client ${socket.id} unsubscribed from sensor ${sensorId}`);
  }

  @OnEvent('sensor.log.created')
  onSensorLogCreated(log: SensorLog) {
    const roomId = RoomId.sensor(log.sensorId);
    this.logger.log(`Emitting new log to room ${roomId}`);
    this.server.to(roomId).emit('sensor.log.created', log);
  }
}
