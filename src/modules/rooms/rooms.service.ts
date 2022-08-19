import {
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
  PaginationInterface,
  PaginationMetaInterface,
} from 'src/ts/interfaces';
import { DEFAULT_PAGINATION_CONFIG } from 'src/ts/consts';
import { AddUserToRoomDto } from './dto/add-user-to-room.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private usersService: UsersService,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = await this.roomsRepository.create(createRoomDto);
    return await this.roomsRepository.save(newRoom);
  }

  async addUserToRoom(roomId: number, data: AddUserToRoomDto): Promise<void> {
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: {
        users: true,
      },
    });

    const user = await this.usersService.findOne(data.id);

    if (!user) {
      throw new NotFoundException('User not found');
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

    const userIndex = room.users.findIndex((user: User) => user.id === data.id);

    if (userIndex !== -1) {
      room.users.splice(userIndex, 1);
      await this.roomsRepository.save(room);
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async findAll(
    pagination: PaginationMetaInterface,
  ): Promise<PaginationInterface<Room>> {
    const { itemsPerPage, page } = {
      ...DEFAULT_PAGINATION_CONFIG,
      ...pagination,
    };
    const take = itemsPerPage;
    const skip = (page - 1) * itemsPerPage;
    const items = await this.roomsRepository.find({
      take,
      skip,
      order: {
        id: 'ASC',
      },
    });

    const total = await this.roomsRepository.count();

    return {
      data: items.reverse(),
      meta: {
        page,
        itemsPerPage,
        total,
      },
    };
  }

  async findOne(id: number): Promise<Room> {
    try {
      return await this.roomsRepository.findOne({
        where: { id },
        relations: {
          users: true,
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
      return await this.roomsRepository.remove(room);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Room not found');
      }
      throw new InternalServerErrorException();
    }
  }
}
