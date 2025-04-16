import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { ExtendedError, Socket } from 'socket.io';
import { ICurrentUser } from 'src/modules/auth/interfaces/current-user.interface';

type WsMiddlewareNext = (err?: ExtendedError) => void;
type WsMiddleware = (socket: Socket, next: WsMiddlewareNext) => void;

export class WsAuthMiddlewareFactory {
  /**
   * Creates a WebSocket middleware to authenticate connection requests using JWT.
   * @param jwtService - The JWT service to use for verifying tokens.
   * @return A middleware function that authenticates WebSocket connections.
   * @throws {WsException} If the token is invalid or not provided.
   */
  static create(jwtService: JwtService): WsMiddleware {
    return async (socket: Socket, next: WsMiddlewareNext) => {
      try {
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
          return next(new WsException('Unauthorized'));
        }

        const payload = await jwtService.verifyAsync(token);

        socket.data.user = {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
          companyId: payload.companyId,
        } as ICurrentUser;

        next();
      } catch (error) {
        next(new WsException('Unauthorized'));
      }
    };
  }
}
