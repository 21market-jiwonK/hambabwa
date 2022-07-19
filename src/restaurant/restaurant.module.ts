import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "./entities/restaurant.entity";
import {HttpModule} from "@nestjs/axios";
import {Menu} from "../menu/entities/menu.entity";
import {CommonModule} from "../common/common.module";
import {ViewMenuWithCategories} from "./entities/v.menu.with.categories.entity";
import {Comment} from "./entities/comment.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([
          Restaurant,
          Menu,
          ViewMenuWithCategories,
          Comment,
      ]),
      HttpModule,
      CommonModule
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule {}
