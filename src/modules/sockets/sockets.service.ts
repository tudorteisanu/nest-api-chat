import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateSocketDto } from './dto/create-socket.dto';
import { MessagesService } from '../messages/messages.service';
import { SocketEvents } from '@/ts/enum';
import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class SocketsService {
  constructor(
    private messageService: MessagesService,
    private authService: AuthService,
  ) {}

  async create(createSocketDto: CreateSocketDto) {
    const event = SocketEvents.AddMessage;
    const data = await this.messageService.create(createSocketDto);
    return { event, data };
  }

  async removeMessage(messageId: number, token: string) {
    const message = await this.messageService.findOne(messageId);

    if (!message) {
      throw new BadRequestException('Message not exists');
    }

    const author = await this.authService.getUserByToken(token);

    if (message.author.id !== author.id) {
      throw new ForbiddenException();
    }

    const event = SocketEvents.DeleteMessage;
    await this.messageService.remove(messageId);
    return {
      event,
      data: {
        messageId,
      },
      roomId: message.room.id,
    };
  }
}
