import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Menu} from "./entities/menu.entity";
import {CommonModule} from "../common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), CommonModule],
  controllers: [MenuController],
  providers: [MenuService]
})
export class MenuModule {}
