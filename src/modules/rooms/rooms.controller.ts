import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationInterface } from '../../ts/interfaces';
import { UpdateResult } from 'typeorm';
import { Room } from './entities/room.entity';
import { AddUserToRoomDto } from './dto/add-user-to-room.dto';
import { PaginationParamsApiDocs } from 'src/decorators';

@ApiBearerAuth()
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(
    @Body() createRoomDto: CreateRoomDto,
    @Req() request: Request & { user: any },
  ) {
    const { user } = request;
    return this.roomsService.create(createRoomDto, user);
  }

  @Post(':id/add-user')
  addUserToRoom(
    @Param('id') roomId: number,
    @Body() createRoomDto: AddUserToRoomDto,
  ) {
    return this.roomsService.addUserToRoom(roomId, createRoomDto);
  }

  @Delete(':id/remove-user')
  removeUserToRoom(
    @Param('id') roomId: number,
    @Body() createRoomDto: AddUserToRoomDto,
  ) {
    return this.roomsService.removeUserToRoom(roomId, createRoomDto);
  }

  @Get()
  @PaginationParamsApiDocs()
  async findAll(
    @Query('itemsPerPage') itemsPerPage = 10,
    @Query('page') page = 1,
    @Req() request: Request & { user: any },
  ): Promise<PaginationInterface<Room>> {
    const { user } = request;
    return await this.roomsService.findAll({ itemsPerPage, page }, user);
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
