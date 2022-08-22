import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { RoomsService } from '@modules/rooms/rooms.service';
import { AuthService } from '@modules/auth/auth.service';
import { SocketEvents } from '@/ts/enum';

interface EmitterInterface {
  event: string;
  data: any;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  cookie: true,
})
export class SocketsGateway {
  @WebSocketServer() server;

  constructor(
    private readonly socketsService: SocketsService,
    private authService: AuthService,
    private rooms: RoomsService,
  ) {}

  @SubscribeMessage(SocketEvents.Connection)
  handleConnection(client: any) {
    if (!client.handshake.auth) {
      client.disconnect();
    }
  }

  @SubscribeMessage(SocketEvents.Join)
  join(client: any, data: string) {
    client.join(data);
  }

  @SubscribeMessage(SocketEvents.Disconnect)
  disconnect(client: any, data: string) {
    client.disconnect(data);
  }

  @SubscribeMessage(SocketEvents.SendMessage)
  async create(client: any, createSocketDto: CreateSocketDto) {
    if (client.handshake.auth?.token) {
      const author = await this.authService.getUserByToken(
        client.handshake.auth.token,
      );

      const payload: EmitterInterface = await this.socketsService.create({
        ...createSocketDto,
        author,
      });

      await this.emitToRoomUsers(createSocketDto.room.id, payload);
    }
  }

  @SubscribeMessage(SocketEvents.DeleteMessage)
  async delete(client: any, messageId: number) {
    const token = client.handshake.auth?.token;
    if (!token) {
      return;
    }
    const { roomId, ...payload }: EmitterInterface & { roomId: number } =
      await this.socketsService.removeMessage(messageId, token);

    await this.emitToRoomUsers(roomId, payload);
  }

  async emitToRoomUsers(
    roomId: number,
    { event, data }: EmitterInterface,
  ): Promise<void> {
    const { users } = await this.rooms.findOne(roomId);

    let emitter = this.server;
    users.forEach(({ id }: { id: number }) => {
      emitter = emitter.to(String(id));
    });

    emitter.emit(event, data);
  }
}
