import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('forgot-password')
  @ApiBody({
    type: ForgotPasswordDto,
  })
  @ApiOkResponse({ status: 200 })
  async forgotPassword(@Req() req: any, @Body() data: ForgotPasswordDto) {
    await this.authService.forgotPassword(data);
    return {
      message: 'Successful',
    };
  }
}
