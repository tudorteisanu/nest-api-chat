import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 150)
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsNotEmpty()
  @Length(2, 150)
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(2, 150)
  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @IsNotEmpty()
  @Length(8, 150)
  @ApiProperty({ example: '12345678' })
  password: string;
}
