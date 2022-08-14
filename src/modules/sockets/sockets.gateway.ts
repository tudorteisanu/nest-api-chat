import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  cookie: true,
})
export class SocketsGateway {
  constructor(private readonly socketsService: SocketsService) {}

  @SubscribeMessage('sendMessage')
  create(@MessageBody() createSocketDto: CreateSocketDto) {
    return this.socketsService.create(createSocketDto);
  }

  @SubscribeMessage('connection')
  handleConnection(client: any) {
    console.log('connected', client.handshake.auth);
  }

  @SubscribeMessage('disconnection')
  handleDisconnect(client: any) {
    console.log('disconnection', client);
  }

  @SubscribeMessage('findAllSockets')
  findAll() {
    return this.socketsService.findAll();
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
