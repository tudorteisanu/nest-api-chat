import { Injectable } from '@nestjs/common';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class SocketsService {
  constructor(private messageService: MessagesService) {}

  async create(createSocketDto: CreateSocketDto) {
    const event = 'addMessage';
    console.log(createSocketDto);
    const data = await this.messageService.create(createSocketDto);
    return { event, data };
  }

  findAll() {
    return `This action returns all sockets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} socket`;
  }

  update(id: number, updateSocketDto: UpdateSocketDto) {
    return `This action updates a #${id} ${updateSocketDto} socket`;
  }

  async remove(id: number) {
    const event = 'removeMessage';
    const data = await this.messageService.remove(id);
    return { event, data };
  }
}
