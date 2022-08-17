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
import { PaginationInterface, RoomInterface } from '../../ts/interfaces';
import { UpdateResult } from 'typeorm';

@ApiBearerAuth()
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
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
  ): Promise<PaginationInterface<RoomInterface>> {
    return await this.roomsService.findAll({ itemsPerPage, page });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoomInterface> {
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
  async remove(@Param('id') id: string): Promise<RoomInterface> {
    return await this.roomsService.remove(+id);
  }
}
