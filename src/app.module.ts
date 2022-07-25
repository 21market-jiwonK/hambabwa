import * as Joi from "@hapi/joi";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { RestaurantModule } from "./restaurant/restaurant.module";
import { DatabaseModule } from "./database/database.module";
import { MenuModule } from "./menu/menu.module";
import { CategoryModule } from "./category/category.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {ClassToPlainInterceptor} from "./common/interceptors/ClassToPlain.interceptor";

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
        PORT: Joi.number(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    RestaurantModule,
    MenuModule,
    CategoryModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
      AppService,
      {
        provide: APP_INTERCEPTOR,
        useClass: ClassToPlainInterceptor
      },
  ],
})
export class AppModule {}
