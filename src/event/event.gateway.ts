import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/websockets',
})
export class EventGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('App Gateway');

  afterInit(server: Server) {
    this.logger.log('Initialize');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connect ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
  }

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(
  //     map((item) => ({ event: 'events', data: item })),
  //   );
  // }

  // @SubscribeMessage('identity')
  // async identity(@MessageBody() data: number): Promise<number> {
  //   return data;
  // }

  // @SubscribeMessage('getMessage')
  // getMessage(@MessageBody() data: string): void {
  //   this.logger.log(`GET MESSAGE FROM CLIENT ${data}`);
  //   this.server.emit('getMessage', { type: 'Alert', message: data });
  // }

  // sendToAll(msg: string) {
  //   this.logger.log(`MESSAGE FROM CLIENT ${msg}`);
  //   this.server.emit('alertToClient', { type: 'Alert', message: msg });
  // }
}
