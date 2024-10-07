import * as cookieParser from 'cookie-parser';
import { LoggerService } from '@app/logx';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InfraModule } from './infra.module';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(
    InfraModule,
    new ExpressAdapter(),
    {
      cors: true,
    },
  );

  const logger = await app.resolve(LoggerService);
  const config = await app.resolve(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );

  app.useLogger(logger);
  app.setGlobalPrefix('api');

  app.use(cookieParser(config.get('APP.APP_COOKIE_SECRET')));

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Pragmatic Clean API')
      .setDescription(
        'Construindo uma API Rest com NestJS utilizando conceitos de `Arquitetura Simples` de forma pragmática.',
      )
      .setVersion('1.0')
      .addTag('pragmatic.clean.api')
      .build(),
  );

  SwaggerModule.setup('api', app, document);

  await app.listen(
    config.getOrThrow('APP.APP_PORT'),
    config.getOrThrow('APP.APP_HOST'),
  );

  logger.debug(`Server running 🚀: ${await app.getUrl()}/api`);
})();
