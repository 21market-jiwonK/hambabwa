import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpStatus,
  UploadedFiles
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import {ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {CommonResponse} from "../common/common.response";

@Controller('menu')
@ApiTags('menu CRUD Api')
export class MenuController {
  constructor(
      private readonly menuService: MenuService
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image1', maxCount: 1},
    { name: 'image2', maxCount: 1},
    { name: 'image3', maxCount: 1},
    { name: 'image4', maxCount: 1},
  ]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({summary: '데일리 메뉴 생성'})
  @ApiCreatedResponse({description: '생성 결과'})
  async create(
      @Body() adminInput: CreateMenuDto,
      @UploadedFiles() images: Express.Multer.File[]
  ) {
    const newMenu = await this.menuService.create(adminInput, images);
    return new CommonResponse(HttpStatus.CREATED, newMenu);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
