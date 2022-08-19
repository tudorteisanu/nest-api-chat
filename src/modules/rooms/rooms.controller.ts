import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationInterface } from '../../ts/interfaces';
import { UpdateResult } from 'typeorm';
import { Room } from './entities/room.entity';
import { AddUserToRoomDto } from './dto/add-user-to-room.dto';

@ApiBearerAuth()
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Post(':id/addUser')
  addUserToRoom(
    @Param('id') roomId: number,
    @Body() createRoomDto: AddUserToRoomDto,
  ) {
    return this.roomsService.addUserToRoom(roomId, createRoomDto);
  }

  @Post(':id/removeUser')
  removeUserToRoom(
    @Param('id') roomId: number,
    @Body() createRoomDto: AddUserToRoomDto,
  ) {
    return this.roomsService.removeUserToRoom(roomId, createRoomDto);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
    example: 1,
  })
  @ApiQuery({
    name: 'itemsPerPage',
    required: false,
    description: 'Items per page',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
    example: 10,
  })
  async findAll(
    @Query('itemsPerPage') itemsPerPage = 10,
    @Query('page') page = 1,
  ): Promise<PaginationInterface<Room>> {
    return await this.roomsService.findAll({ itemsPerPage, page });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Room> {
    return await this.roomsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<UpdateResult> {
    return await this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Room> {
    return await this.roomsService.remove(+id);
  }
}
