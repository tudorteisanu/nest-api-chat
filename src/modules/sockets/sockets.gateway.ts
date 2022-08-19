import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
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

      const { users } = await this.rooms.findOne(createSocketDto.roomId);
      users.forEach(({ id }: { id: number }) => {
        this.server.to(String(id)).emit(event, data);
      });
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

  @SubscribeMessage('findOneSocket')
  findOne(@MessageBody() id: number) {
    return this.socketsService.findOne(id);
  }

  @SubscribeMessage('updateSocket')
  update(@MessageBody() updateSocketDto: UpdateSocketDto) {
    return this.socketsService.update(updateSocketDto.id, updateSocketDto);
  }

  @SubscribeMessage('removeSocket')
  remove(@MessageBody() id: number) {
    return this.socketsService.remove(id);
  }
}
