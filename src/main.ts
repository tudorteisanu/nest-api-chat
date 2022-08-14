import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException({
          errors: errors.reduce((errors: any, error: any) => {
            errors[error.property] = Object.values(error.constraints);
            return errors;
          }, {}),
          statusCode: 422,
        });
      },
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'storage'));

  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Test api')
    .setDescription(
      'The nestjs API description. <br /> BASE URL: [api.nanoit.dev](https://api.nanoit.dev) ' +
        '<br />For this sample, you can use the  `bearer token` to test the authorization filters.' +
        '<br /><br /> <b> Just a few steps. </b>' +
        '<br />1. Register using request below' +
        '<br />2. Login using register credentials' +
        '<br />3. Add `token` to autorize' +
        '<br />4. Enjoi it' +
        '<br /><br /><br />' +
        '<strong>Example request:</strong>' +
        '<br />GET: <i>https://api.nanoit.dev/users</i>',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.APP_PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`App listen on localhost:${port}`);
}

bootstrap();
