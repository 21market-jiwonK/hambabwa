import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import { RestaurantModule } from './restaurant/restaurant.module';
import {DatabaseModule} from "./database/database.module";
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `config/.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validationSchema: Joi.object({
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DB: Joi.string().required(),
        PORT: Joi.number()
      })
    }),
    DatabaseModule,
    RestaurantModule,
    MenuModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
