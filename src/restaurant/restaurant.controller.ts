import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import {ApiCreatedResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Restaurant} from "./entities/restaurant.entity";
import {CommonResponse} from "../common/common.response";
import {DeleteResult, UpdateResult} from "typeorm";

@Controller('restaurant')
@ApiTags('restaurant CRUD Api')
export class RestaurantController {
  constructor(
      private readonly restaurantService: RestaurantService
  ) {}

  @Post()
  @ApiOperation({summary: '식당을 생성한다.'})
  @ApiCreatedResponse({description: '생성 결과', type: Restaurant})
  async create(
      @Body() adminInput: CreateRestaurantDto
  ) {
    const newRestaurant: Restaurant = await this.restaurantService.create(adminInput);
    return new CommonResponse(HttpStatus.CREATED, newRestaurant);
  }

  @Get()
  @ApiOperation({summary: '식당 목록을 조회한다.'})
  @ApiCreatedResponse({description: '목록 조회 결과', type: Restaurant, isArray: true})
  async findAll() {
    const lists: Restaurant[] = await this.restaurantService.findAll();
    return new CommonResponse(HttpStatus.OK, lists);
  }

  @Get(':id')
  async findOne(
      @Param('id') id: number
  ) {
    const menuWithRestaurant: Restaurant = await this.restaurantService.findOne(id);
    return new CommonResponse(HttpStatus.OK, menuWithRestaurant);
  }

  @Patch(':id')
  async update(
      @Param('id') id: number,
      @Body() updateInput: UpdateRestaurantDto
  ) {
    const result: UpdateResult = await this.restaurantService.update(id, updateInput);
    return new CommonResponse(HttpStatus.OK, result);
  }

  @Delete(':id')
  async remove(
      @Param('id') id: number
  ) {
    const result: DeleteResult = await this.restaurantService.remove(id);
    return new CommonResponse(HttpStatus.OK, result);
  }
}
