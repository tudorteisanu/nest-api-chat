import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { GoogleMailService } from '../../services/google-mail/google-mail.service';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, GoogleMailService],
  imports: [UsersModule],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
