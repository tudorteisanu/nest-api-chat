import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsNotEmpty()
  @Length(8, 256)
  @ApiProperty({ example: '1s2ASD3d4@5678' })
  password: string;

  @IsNotEmpty()
  @Length(8, 256)
  @ApiProperty({ example: '1s2ASD3d4@5678' })
  passwordConfirmation: string;

  @IsNotEmpty()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1Nzk5OTk0OSwiZXhwIjoxNjYwNTkxOTQ5fQ.FmytpvJ1xL8hhrJBeMNeU6tvgbHy23Eq6P3eHGZpADo',
  })
  token: string;
}
