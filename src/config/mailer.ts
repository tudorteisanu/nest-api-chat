import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const getMailerConfig: any = () => ({
  transport: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  },
  defaults: {
    from: process.env.MAIL_DEFAULT_SENDER,
  },
  template: {
    dir: join(__dirname, '../templates'),
    adapter: new HandlebarsAdapter(undefined, {
      inlineCssEnabled: true,
      inlineCssOptions: {
        url: ' ',
        preserveMediaQueries: true,
      },
    }),
    options: {
      strict: true,
    },
  },
});

export default getMailerConfig;
