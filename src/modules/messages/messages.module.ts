import { Global, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';

@Global()
@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  exports: [MessagesService, TypeOrmModule.forFeature([MessageEntity])],
})
export class MessagesModule {}
