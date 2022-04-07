import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION')
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  app.setGlobalPrefix('api');
  app.enableCors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    origin: (process.env.NODE_ENV === 'development' ? true : configService.get('ACCESS_CONTROL_ALLOW_ORIGINS')),
    credentials: true
  });

  const configBuilder = new DocumentBuilder()
      .setTitle('gittle-backend')
      .setDescription('gittle 2.0 API')
      .setVersion('2.0')
      .addTag('gittle')
      .addBearerAuth(
          { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          'access-token',
      )
      .build();

  const document = SwaggerModule.createDocument(app, configBuilder);
  SwaggerModule.setup('api/v2/docs', app, document, {
    customCss: '.swagger-ui section.models { display: none;}'
  });

  await app.listen(configService.get('PORT'));
  console.log(process.env.NODE_ENV);
}
bootstrap();
