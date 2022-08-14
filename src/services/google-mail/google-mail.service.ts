import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailViews } from 'src/ts/enum';

interface ForgotPasswordInterface {
  email: string;
  subject: string;
  template: MailViews;
  context: any;
}

@Injectable()
export class GoogleMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: ForgotPasswordInterface) {
    try {
      await this.mailerService.sendMail({
        to: options.email,
        subject: options.subject,
        template: options.template,
        context: options.context,
      });
    } catch (e) {
      throw e;
    }
  }
}
