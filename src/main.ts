import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyCookie from 'fastify-cookie';

import { MainModule } from 'src/main.module';
import { InternalServerErrorFilter, QueryFailedErrorFilter } from './helpers/filters';
import { Logger } from 'src/services/logger/logger.service';
import { TransformInterceptor } from './helpers/interceptors';

declare const module: {
  hot: {
    accept: () => void;
    dispose: (arg: () => void) => void;
  };
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter({
      logger: false,
    }),
  );

  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  // Get Custom Logger
  app.useLogger(new Logger());

  // Load ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT');
  const env = configService.get('ENV');

  // Setup Swagger
  if (env !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Pigskin Fantasty U - ' + env)
      .setDescription('The API')
      .setVersion('0.0.1')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  app.useGlobalFilters(new InternalServerErrorFilter());
  app.useGlobalFilters(new QueryFailedErrorFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  // Setup Global Validations
  app.useGlobalPipes(
    new ValidationPipe({
      // This will remove any non acceptable properties from the response
      // whitelist: true,
      // Transforms our incoming JSON payloads into their typed classes
      transform: true,
    }),
  );

  await app.listen(port, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
