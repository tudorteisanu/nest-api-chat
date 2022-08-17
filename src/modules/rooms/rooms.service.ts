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
  RoomInterface,
} from 'src/ts/interfaces';
import { DEFAULT_PAGINATION_CONFIG } from 'src/ts/consts';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<RoomInterface> {
    const newRoom = await this.roomsRepository.create(createRoomDto);
    return await this.roomsRepository.save(newRoom);
  }

  async findAll(
    pagination: PaginationMetaInterface,
  ): Promise<PaginationInterface<RoomInterface>> {
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

  async findOne(id: number): Promise<RoomInterface> {
    try {
      return await this.roomsRepository.findOneByOrFail({ id });
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

  async remove(id: number): Promise<RoomInterface> {
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
