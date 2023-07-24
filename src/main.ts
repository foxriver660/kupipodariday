import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';
import { loggerConfig } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4200);
}

bootstrap();
