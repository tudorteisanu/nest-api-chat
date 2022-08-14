import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsNotEmpty()
  @Length(2, 256)
  @ApiProperty({ minLength: 2, maxLength: 256, example: 'John' })
  firstName: string;

  @IsNotEmpty()
  @Length(2, 256)
  @ApiProperty({ minLength: 2, maxLength: 256, example: 'Doe' })
  lastName: string;
}
