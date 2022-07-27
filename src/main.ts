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

  const whiteLists = ['https://test.hambabwa.kr:3000', 'http://localhost:3000', 'https://hambabwa.kr']
  app.enableCors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    //origin: (process.env.NODE_ENV === 'development' ? true : configService.get('ACCESS_CONTROL_ALLOW_ORIGINS')),
    //origin: true,
    origin: function (origin, callback) {
      if (whiteLists.indexOf(origin) !== -1) {
        console.log("allowed cors for::", origin);
        callback(null, true);
      } else {
        console.log("blocked cors for::", origin);
        //callback(new Error('Not allowed by CORS'));
        callback(null, true);
      }
    },
    credentials: true,
    exposedHeaders: 'Authorization',
  });
  const configBuilder = new DocumentBuilder()
      .setTitle('강남함바 ^_^?')
      .setDescription('hambabwa API')
      .setVersion('1.0')
      .addTag('hamba')
      .addBearerAuth(
          { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          'access-token',
      )
      .build();

  const document = SwaggerModule.createDocument(app, configBuilder);
  SwaggerModule.setup('v1/api/docs', app, document, {
    customCss: '.swagger-ui section.models { display: none;}'
  });

  await app.listen(configService.get('PORT'));
  console.log(process.env.NODE_ENV);
}
bootstrap();
