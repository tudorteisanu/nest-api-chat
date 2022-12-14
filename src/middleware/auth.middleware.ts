import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: any, res: Response, next: NextFunction) {
    const authHeaders: any = req.headers.authorization;

    if (authHeaders) {
      const user = await this.authService.getUserByToken(authHeaders);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }

      this.authService.userEvent.next(user);
      req.user = user;
    } else {
      throw new UnauthorizedException();
    }
    next();
  }
}
