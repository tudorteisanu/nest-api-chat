import { ApiProperty } from '@nestjs/swagger';

export class StoreFile {
  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  file: any;
}

export class StoreFileResponse {
  @ApiProperty({
    example: 23,
  })
  id: number;

  @ApiProperty({
    example: 'uploaded-file.png',
  })
  name: string;

  @ApiProperty({
    example: 'https://some-domain.com/uploaded-file.png',
  })
  url: string;

  @ApiProperty({
    example: 22343,
  })
  size: number;

  @ApiProperty({
    example: 'image/png',
  })
  mimeType: string;
}
