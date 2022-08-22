import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository, UpdateResult } from 'typeorm';
import { Room } from './entities/room.entity';
import {
  MessageInterface,
  PaginationInterface,
  PaginationMetaInterface,
} from 'src/ts/interfaces';
import { DEFAULT_PAGINATION_CONFIG } from 'src/ts/consts';
import { AddUserToRoomDto } from './dto/add-user-to-room.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private usersService: UsersService,
    private messagesService: MessagesService,
  ) {}

  async create(createRoomDto: CreateRoomDto, user: User): Promise<Room> {
    const newRoom = await this.roomsRepository.create(createRoomDto);
    newRoom.users = [user];
    const createdUser = await this.roomsRepository.save(newRoom, {
      transaction: true,
    });
    return {
      ...createdUser,
      users: createdUser.users.map((user: User) => {
        delete user.password;
        return user;
      }),
    };
  }

  async addUserToRoom(roomId: number, data: AddUserToRoomDto): Promise<void> {
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: {
        users: true,
      },
    });

    const user = await this.usersService.findOne(data.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (room.users.some((user: User) => user.id === data.userId)) {
      throw new BadRequestException('User already exists');
    }

    room.users = [...room.users, user];
    await this.roomsRepository.save(room);
  }

  async removeUserToRoom(
    roomId: number,
    data: AddUserToRoomDto,
  ): Promise<void> {
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: {
        users: true,
      },
    });

    const userIndex = room.users.findIndex(
      (user: User) => user.id === data.userId,
    );

    if (userIndex !== -1) {
      room.users.splice(userIndex, 1);
      await this.roomsRepository.save(room);
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async findAll(
    pagination: PaginationMetaInterface,
    user: User,
  ): Promise<PaginationInterface<Room & { lastMessage: MessageInterface }>> {
    const { itemsPerPage, page } = {
      ...DEFAULT_PAGINATION_CONFIG,
      ...pagination,
    };
    const take = itemsPerPage;
    const skip = (page - 1) * itemsPerPage;
    const records = await this.roomsRepository.find({
      take,
      skip,
      order: {
        id: 'ASC',
      },
      where: {
        users: {
          id: user.id,
        },
      },
    });

    const items = await this.addLastMessage(records);
    const total = await this.roomsRepository.count();

    return {
      data: items.sort(
        (a, b) => b.lastMessage?.createdAt - a.lastMessage?.createdAt,
      ),
      meta: {
        page,
        itemsPerPage,
        total,
      },
    };
  }

  private async addLastMessage(records: any) {
    for (const item of records) {
      item.lastMessage = await this.messagesService.getRoomLastMessage(item.id);
    }
    return records;
  }

  async findOne(id: number): Promise<Room> {
    try {
      return await this.roomsRepository.findOne({
        where: { id },
        relations: {
          users: true,
        },
        select: {
          users: {
            id: true,
            firstName: true,
            lastName: true,
          },
          id: true,
          name: true,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Room not found');
      }
    }
  }

  async update(
    id: number,
    updateRoomDto: UpdateRoomDto,
  ): Promise<UpdateResult> {
    try {
      await this.roomsRepository.findOneByOrFail({ id });
      return await this.roomsRepository.update(id, updateRoomDto);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Room not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<Room> {
    try {
      const room = await this.roomsRepository.findOneByOrFail({ id });
      return await this.roomsRepository.remove(room, {});
    } catch (e) {
      console.log(e);
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Room not found');
      }
      throw new InternalServerErrorException();
    }
  }
}
