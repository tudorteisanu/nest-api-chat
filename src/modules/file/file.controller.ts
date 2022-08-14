import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Helper } from 'src/utils';
import { diskStorage } from 'multer';
import { FileService } from './file.service';
import { StoreFile, StoreFileResponse } from './responses';

@ApiBearerAuth()
@ApiTags('upload')
@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @ApiBody({ type: StoreFile })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Successful created.',
    type: StoreFileResponse,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: Helper.customFileName,
        destination: Helper.destinationPath,
      }),
    }),
  )
  uploadFile(
    @Req() req: any,
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return new BadRequestException(`Invalid file`);
    }

    return this.fileService.create(file);
  }
}
