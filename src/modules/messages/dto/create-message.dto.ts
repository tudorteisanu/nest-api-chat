import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @IsNotEmpty()
  @ApiProperty()
  roomId: number;
}
