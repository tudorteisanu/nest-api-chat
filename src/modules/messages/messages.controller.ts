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
import { PaginationParamsApiDocs } from '@/decorators';
import { MessageEntity } from '@modules/messages/entities/message.entity';
import { DEFAULT_PAGINATION_CONFIG } from '@/ts/consts';

@ApiBearerAuth()
@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<CreateMessageDto & MessageEntity> {
    return await this.messagesService.create(createMessageDto);
  }

  @Get()
  @PaginationParamsApiDocs()
  async findAll(
    @Query('roomId') roomId: string,
    @Query('itemsPerPage')
    itemsPerPage = DEFAULT_PAGINATION_CONFIG.itemsPerPage,
    @Query('page') page = DEFAULT_PAGINATION_CONFIG.page,
  ): Promise<PaginationInterface<MessageInterface>> {
    return await this.messagesService.findAll(Number(roomId), {
      itemsPerPage: Number(itemsPerPage),
      page: Number(page),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MessageEntity> {
    return await this.messagesService.findOne(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<UpdateResult> {
    return await this.messagesService.update(Number(id), updateMessageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MessageEntity> {
    return await this.messagesService.remove(Number(id));
  }
}
