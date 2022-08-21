import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository, UpdateResult } from 'typeorm';
import { MessageEntity } from './entities/message.entity';
import { DEFAULT_PAGINATION_CONFIG } from 'src/ts/consts';
import {
  MessageInterface,
  PaginationInterface,
  PaginationMetaInterface,
} from 'src/ts/interfaces';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async create(payload: CreateMessageDto) {
    return await this.messageRepository.save(payload);
  }

  async findAll(
    roomId: number,
    pagination: PaginationMetaInterface,
  ): Promise<PaginationInterface<MessageInterface>> {
    const { itemsPerPage, page } = {
      ...DEFAULT_PAGINATION_CONFIG,
      ...pagination,
    };
    const take = itemsPerPage;
    const skip = (page - 1) * itemsPerPage;
    const items = await this.messageRepository.find({
      take,
      skip,
      where: {
        room: {
          id: roomId,
        },
      },
      order: {
        id: 'DESC',
      },
      relations: {
        room: true,
        author: true,
        attachments: true,
      },
    });
    const total = await this.messageRepository.count();

    return {
      data: items
        .map((item: any) => ({
          ...item,
          attachments: item.attachments.map((file: any) => ({
            ...file,
            url: `${process.env.APP_HOST}/${file.filename}`,
          })),
        }))
        .reverse(),
      meta: {
        page,
        itemsPerPage,
        total,
      },
    };
  }

  async findOne(id?: number): Promise<MessageInterface> {
    try {
      return await this.messageRepository.findOneByOrFail({ id });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Room not found');
      }
    }
  }

  async getRoomLastMessage(roomId: number): Promise<MessageInterface> {
    try {
      return await this.messageRepository.findOne({
        where: {
          room: { id: roomId },
        },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Room not found');
      }
    }
  }

  async update(id: number, payload: UpdateMessageDto): Promise<UpdateResult> {
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

  async remove(id: number): Promise<MessageInterface> {
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
