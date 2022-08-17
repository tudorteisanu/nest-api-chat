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
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MessageInterface, PaginationInterface } from 'src/ts/interfaces';
import { UpdateResult } from 'typeorm';

@ApiBearerAuth()
@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageInterface> {
    return await this.messagesService.create(createMessageDto);
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
    @Query('roomId') roomId: string,
    @Query('itemsPerPage') itemsPerPage = 10,
    @Query('page') page = 1,
  ): Promise<PaginationInterface<MessageInterface>> {
    return await this.messagesService.findAll(Number(roomId), {
      itemsPerPage: Number(itemsPerPage),
      page: Number(page),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MessageInterface> {
    return await this.messagesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<UpdateResult> {
    return await this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MessageInterface> {
    return await this.messagesService.remove(+id);
  }
}
