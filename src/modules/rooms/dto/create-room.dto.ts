import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @Length(2, 150)
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
