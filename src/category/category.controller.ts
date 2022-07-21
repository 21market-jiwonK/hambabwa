import {Controller, Post, UseInterceptors, UploadedFile, Get, Put} from '@nestjs/common';
import { CategoryService } from './category.service';
import {ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {Category} from "./entities/category.entity";

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary'}}}})
  @ApiOperation({ summary: '카테고리 엑셀 업로드', description: '카테고리를 파일로 업로드 한다.' })
  @ApiCreatedResponse({description: '단가표 업로드 결과'})
  async createByExcel(
    @UploadedFile() file: Express.Multer.File
  ){
    return await this.categoryService.createByExcel(file);
  }

  @Get()
  @ApiOperation({ summary: '대 카테고리 목록 조회 API', description: '대 카테고리 목록을 조회한다.' })
  @ApiCreatedResponse({description: '목록조회 결과'})
  async findRoots(): Promise<Category[]>
  {
    return await this.categoryService.findRoots();
  }

  @Put('isLeaf')
  @ApiOperation({ summary: 'isLeaf 컬럼 업데이트 API', description: 'isLeaf 컬럼을 업데이트 한다.' })
  async updateLeafCategories(): Promise<boolean> {
    return await this.categoryService.updateIsLeaf()
  }

  @Put('codes')
  @ApiOperation({ summary: 'menuCategoryCode 컬럼 업데이트 API', description: 'menuCategoryCode 컬럼을 업데이트 한다.' })
  async updateMenuCategoryCodes():Promise<boolean> {
    return await this.categoryService.updateMenuCategoryCodes();
  }
}
