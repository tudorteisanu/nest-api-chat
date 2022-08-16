import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Helper } from '../../utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async create(payload: CreateFileDto) {
    const file = await this.fileRepository.save({
      ...payload,
      path: `${process.env.FILE_UPLOAD_FOLDER}/${payload.filename}`,
    });

    return {
      id: file.id,
      url: Helper.getFileUrl(file.filename),
      name: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async findOne(id: number) {
    const file = await this.fileRepository.findOneBy({ id });

    return {
      id: file.id,
      url: Helper.getFileUrl(file.filename),
      name: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async update(id: number, data: UpdateFileDto) {
    return await this.fileRepository.update(id, data);
  }

  remove(id: number) {
    return this.fileRepository.delete(id);
  }
}
