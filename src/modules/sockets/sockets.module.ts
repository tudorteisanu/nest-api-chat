import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';
import { MessagesModule } from '../messages/messages.module';
import { MessagesService } from '../messages/messages.service';

@Module({
  providers: [SocketsGateway, SocketsService, MessagesService],
  imports: [MessagesModule],
})
export class SocketsModule {}
