import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile, UseGuards, Req
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import {ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Restaurant} from "./entities/restaurant.entity";
import {DeleteResult} from "typeorm";
import {FileInterceptor} from "@nestjs/platform-express";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {Comment} from "./entities/comment.entity";
import {UpdateCommentDto} from "./dto/update-comment.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import { RequestWithUser } from 'src/user/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/roles.decorators';

@Controller('restaurant')
@ApiTags('Restaurant CRUD Api')
export class RestaurantController {
  constructor(
      private readonly restaurantService: RestaurantService
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @UseInterceptors(FileInterceptor('imageUrl'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '식당 생성 API', description: '식당을 생성 한다.' })
  @ApiCreatedResponse({description: '생성 결과'})
  async create(
    @Body() adminInput: CreateRestaurantDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Restaurant> {
    return await this.restaurantService.create(adminInput, image);
  }

  @Get()
  @ApiOperation({ summary: '식당 목록을 조회 API', description: '식당 목록을 조회한다.' })
  @ApiCreatedResponse({description: '목록 조회 결과', type: Restaurant, isArray: true})
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: '식당 상세 정보 조회 API', description: '식당 상세 정보를 조회한다.'})
  @ApiCreatedResponse({ description: '조회 결과', type: Restaurant })
  async findOne(
    @Param('id') id: number
  ): Promise<Restaurant> {
    return await this.restaurantService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles("admin")
  @UseInterceptors(FileInterceptor('_imageUrl'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '식당 수정 API', description: '식당 상세 정보를 수정 한다.' })
  @ApiCreatedResponse({description: '업로드 결과'})
  async update(
    @Param('id') id: number,
    @Body() updateInput: UpdateRestaurantDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Restaurant> {
    return await this.restaurantService.update(id, updateInput, file);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: '식당 삭제 API', description: '식당 상세 정보를 삭제 한다.' })
  @ApiCreatedResponse({description: '삭제 결과'})
  async remove(
    @Param('id') id: number
  ): Promise<DeleteResult> {
    return await this.restaurantService.remove(id);
  }

  @Post('comment')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '코멘트 생성 API', description: '코멘트를 생성한다.' })
  @ApiCreatedResponse({description: '생성 결과'})
  async createComment(
    @Req() { user }: RequestWithUser,
    @Body() userInput: CreateCommentDto
  ): Promise<Comment> {
    userInput.writer = user;
    return await this.restaurantService.createComment(userInput);
  }

  @Patch('comment/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '코멘트 수정 API', description: '코멘트를 수정한다.' })
  @ApiCreatedResponse({description: '수정 결과'})
  async updateComment(
    @Req() { user }: RequestWithUser,
    @Param('id') id: number,
    @Body() userInput: UpdateCommentDto
  ): Promise<Comment> {
    userInput.writer = user;
    return await this.restaurantService.updateComment(id, userInput);
  }

  @Delete('comment/:id')
  @ApiOperation({ summary: '코멘트 삭제 API', description: '코멘트를 삭제한다.' })
  @ApiCreatedResponse({description: '삭제 결과'})
  async removeComment(
    @Param('id') id: number,
  ): Promise<DeleteResult> {
    return await this.restaurantService.removeComment(id);
  }
}