import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    const newRoom = await this.roomsRepository.create(createRoomDto);
    return await this.roomsRepository.save(newRoom);
  }

  findAll() {
    return this.roomsRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.roomsRepository.findOneByOrFail({ id });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Room not found');
      }
    }
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
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

  async remove(id: number) {
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
