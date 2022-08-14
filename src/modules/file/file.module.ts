import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [TypeOrmModule.forFeature([FileEntity])],
})
export class FileModule {}
