import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordDto {
  @IsNotEmpty()
  @Length(8, 256)
  @ApiProperty({ example: '1s2ASD3d4@5678' })
  password: string;
}

export class ChangePasswordDto extends PasswordDto {
  @IsNotEmpty()
  @Length(8, 256)
  @ApiProperty({ example: '1s2ASD3d4@5678' })
  passwordConfirmation: string;

  @IsNotEmpty()
  @Length(8, 256)
  @ApiProperty({ example: '1s2ASD3d4@5678' })
  oldPassword: string;
}

export class LoginDto extends PasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'test@domain.com' })
  email: string;
}
