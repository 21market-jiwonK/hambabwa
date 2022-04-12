import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "./entities/restaurant.entity";
import {HttpModule} from "@nestjs/axios";
import {Menu} from "../menu/entities/menu.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([Restaurant, Menu]),
      HttpModule
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule {}
