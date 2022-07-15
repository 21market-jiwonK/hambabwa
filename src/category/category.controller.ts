import {Controller, Post, UseInterceptors, UploadedFile} from '@nestjs/common';
import { CategoryService } from './category.service';
import {ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";

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
}
