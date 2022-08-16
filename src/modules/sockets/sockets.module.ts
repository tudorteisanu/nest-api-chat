import { Global, Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';
import { MessagesModule } from '../messages/messages.module';
import { MessagesService } from '../messages/messages.service';
import { RoomsModule } from '../rooms/rooms.module';

@Global()
@Module({
  providers: [SocketsGateway, SocketsService, MessagesService],
  imports: [MessagesModule, RoomsModule],
  exports: [SocketsGateway],
})
export class SocketsModule {}
