import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ChangePasswordDto, LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailViews } from 'src/ts/enum';
import { GoogleMailService } from 'src/services/google-mail/google-mail.service';
import { BehaviorSubject } from 'rxjs';

const secret = 'some_secret';

@Injectable()
export class AuthService {
  userEvent: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private gmailService: GoogleMailService,
  ) {}

  async validatePassword(password, passwordHash) {
    if (!this.userService.comparePassword(password, passwordHash)) {
      throw new UnprocessableEntityException('Invalid password');
    }
  }

  async validateUser(payload: LoginDto): Promise<any> {
    try {
      const user = await this.userService.findOneBy({ email: payload.email });
      await this.validatePassword(payload.password, user.password);

      const result = { ...user };
      delete result.password;

      return result;
    } catch (e) {
      if (e instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException(e.message);
      }

      throw new NotFoundException(e.message);
    }
  }

  async login(payload: LoginDto) {
    try {
      const user = await this.validateUser(payload);

      const claims = { email: user.email, sub: user.id };

      return {
        token: this.jwtService.sign(claims, { secret }),
        user,
      };
    } catch (e) {
      throw e;
    }
  }

  async getUserByToken(token: string): Promise<any> {
    const credentials = (await this.jwtService.decode(
      token.replace('Bearer ', ''),
    )) as any;

    if (!credentials) {
      throw new BadRequestException('No credentials');
    }

    const { sub } = credentials;
    return await this.userService.findOne(sub);
  }

  register(payload: RegisterDto) {
    return this.userService.create(payload);
  }

  async checkResetToken({ token }: TokenDto) {
    const userToken = this.jwtService.decode(token) as any;
    if (!userToken) {
      throw new BadRequestException('Invalid token');
    }

    return true;
  }

  async validatePasswordMatch(payload: ChangePasswordDto) {
    if (payload.password !== payload.passwordConfirmation) {
      throw new UnprocessableEntityException('Password mismatch');
    }

    if (payload.password === payload.oldPassword) {
      throw new UnprocessableEntityException(
        'The new password must be different from the old one',
      );
    }
  }

  async resetUserPassword(userId: number, payload: any): Promise<void> {
    await this.validatePasswordMatch(payload);
    await this.changeUserPassword(userId, payload.password);
  }

  async changeUserPassword(userId, plainPassword) {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(plainPassword, salt);

    return this.userService.update(userId, { password });
  }
  //
  // private async checkToken(token: string): Promise<number> {
  //   const userToken = this.jwtService.decode(token) as any;
  //
  //   if (!userToken) {
  //     throw new BadRequestException('Invalid token');
  //   }
  //
  //   return userToken.userId;
  // }

  async forgotPassword(payload: ForgotPasswordDto) {
    const user = await this.userService.findOneBy({ email: payload.email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign({ userId: user.id }, { secret });
    const link = encodeURI(
      `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`,
    );
    await this.gmailService.sendMail({
      email: user.email,
      subject: 'Reset your password',
      template: MailViews.ForgotPassword,
      context: {
        link,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
    return true;
  }
}
