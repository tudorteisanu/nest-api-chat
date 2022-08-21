import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { AuthService } from '../auth/auth.service';
import { RoomsService } from '../rooms/rooms.service';

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

  @SubscribeMessage('sendMessage')
  async create(client: any, createSocketDto: CreateSocketDto) {
    if (client.handshake.auth?.token) {
      const author = await this.authService.getUserByToken(
        client.handshake.auth.token,
      );

      const { event, data } = await this.socketsService.create({
        ...createSocketDto,
        author,
      });

      const { users } = await this.rooms.findOne(createSocketDto.room.id);

      let emitter = this.server;
      users.forEach(({ id }: { id: number }) => {
        emitter = emitter.to(String(id));
      });

      emitter.emit(event, data);
    }
  }

  @SubscribeMessage('connection')
  handleConnection(client: any) {
    if (!client.handshake.auth) {
      client.disconnect();
    }
  }

  @SubscribeMessage('findAllSockets')
  findAll() {
    return this.socketsService.findAll();
  }

  @SubscribeMessage('join')
  join(client: any, data: string) {
    client.join(data);
  }

  @SubscribeMessage('disconnect')
  disconnect(client: any, data: string) {
    client.disconnect(data);
  }
}
