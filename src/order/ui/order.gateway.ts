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
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('socket connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('socket disconnected:', client.id);
  }

  @SubscribeMessage('joinRestaurantRoom')
  async joinRestaurantRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { restaurantId: string },
  ) {
    await client.join(`restaurant:${body.restaurantId}`);
    return { ok: true };
  }

  @SubscribeMessage('joinOrderRoom')
  async joinOrderRoom(
    @MessageBody() body: { orderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`order:${body.orderId}`);
    return { ok: true };
  }

  emitOrderCreated(restaurantId: string, payload: any) {
    this.server.to(`restaurant:${restaurantId}`).emit('order.created', payload);
  }

  emitOrderStatusChanged(orderId: string, payload: any) {
    this.server.to(`order:${orderId}`).emit('order.statusChanged', payload);
  }

  @SubscribeMessage('leaveRestaurantRoom')
  async leaveRestaurantRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { restaurantId: string },
  ) {
    await client.leave(`restaurant:${body.restaurantId}`);

    return { ok: true };
  }

  @SubscribeMessage('leaveOrderRoom')
  async leaveOrderRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { orderId: string },
  ) {
    await client.leave(`order:${body.orderId}`);

    return { ok: true };
  }
}
