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
    return await this.messageRepository.save(payload);
  }

  async findAll(roomId: number) {
    const items = await this.messageRepository.find({
      where: {
        room: {
          id: roomId,
        },
      },
      relations: {
        room: true,
        author: true,
        attachments: true,
      },
    });

    return items.map((item: any) => ({
      ...item,
      attachments: item.attachments.map((file: any) => ({
        ...file,
        url: `${process.env.APP_HOST}/${file.filename}`,
      })),
    }));
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
