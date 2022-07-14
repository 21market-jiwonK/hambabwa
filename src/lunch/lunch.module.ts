import { Module } from '@nestjs/common';
import { LunchService } from './lunch.service';
import { LunchController } from './lunch.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Lunch} from "./entities/lunch.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([Lunch])
  ],
  controllers: [LunchController],
  providers: [LunchService]
})
export class LunchModule {}
