// src/order/order.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'http://yhj-bucket-test.s3-website.ap-northeast-2.amazonaws.com',
      'http://localhost:5173',
      'https://hyungjoon-yoon.click',
    ],
    credentials: true,
  },
})
export class RestaurantGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('socket connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('socket disconnected:', client.id);
  }

  @SubscribeMessage('joinRestaurantStatusRoom')
  async joinRestaurantStatusRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { restaurantId: string },
  ) {
    await client.join(`restaurantStatus:${body.restaurantId}`);
    return { ok: true };
  }

  emitRestaurantStatusChanged(restaurantId: string, payload: any) {
    this.server
      .to(`restaurantStatus:${restaurantId}`)
      .emit('restaurant.statusChanged', payload);
  }

  @SubscribeMessage('leaveRestaurantStatusRoom')
  async leaveRestaurantStatusRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { restaurantId: string },
  ) {
    await client.leave(`restaurantStatus:${body.restaurantId}`);

    return { ok: true };
  }
}
