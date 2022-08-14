import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}
  async create(payload: CreateMessageDto) {
    const newRoom = await this.messageRepository.create(payload);
    return await this.messageRepository.save(newRoom);
  }

  findAll() {
    return this.messageRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.messageRepository.findOneByOrFail({ id });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Room not found');
      }
    }
  }

  async update(id: number, payload: UpdateMessageDto) {
    try {
      await this.messageRepository.findOneByOrFail({ id });
      return await this.messageRepository.update(id, payload);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Room not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const room = await this.messageRepository.findOneByOrFail({ id });
      return await this.messageRepository.remove(room);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Room not found');
      }
      throw new InternalServerErrorException();
    }
  }
}
