import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserToRoomDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;
}
