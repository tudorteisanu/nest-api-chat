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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageInterface, PaginationInterface } from 'src/ts/interfaces';
import { UpdateResult } from 'typeorm';
import { PaginationParamsApiDocs } from '../../decorators';

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
  @PaginationParamsApiDocs()
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
