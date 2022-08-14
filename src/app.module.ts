import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RoomsModule } from './modules/rooms/rooms.module';
import { MessagesModule } from './modules/messages/messages.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SocketsModule } from './modules/sockets/sockets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './middleware/auth.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import {
  AuthMiddlewareIgnorePaths,
  DatabaseConfig,
  MailerConfig,
} from './config';
import { GoogleMailService } from './services/google-mail/google-mail.service';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    RoomsModule,
    MessagesModule,
    UsersModule,
    AuthModule,
    SocketsModule,
    FileModule,
    TypeOrmModule.forRoot({ ...DatabaseConfig() }),
    MailerModule.forRoot({ ...MailerConfig() }),
  ],
  controllers: [],
  providers: [GoogleMailService],
  exports: [GoogleMailService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...AuthMiddlewareIgnorePaths)
      .forRoutes('*');
  }
}
