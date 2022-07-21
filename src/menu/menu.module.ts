import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Menu} from "./entities/menu.entity";
import {CategoryModule} from "../category/category.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Menu]),
      CategoryModule,
  ],
  controllers: [MenuController],
  providers: [MenuService]
})
export class MenuModule {}
