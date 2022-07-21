import { Injectable } from '@nestjs/common';
import {CreateCategoryExcelDto} from "./dto/create-category-excel.dto";
import {CommonService} from "../common/common.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "./entities/category.entity";
import {TreeRepository} from "typeorm";

@Injectable()
export class CategoryService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
  ) {}

  async createByExcel(file: Express.Multer.File) {
    const rows: CreateCategoryExcelDto[] = this.commonService.uploadExcel(file);
    let insertRows: Category[] = [];
    for (const row of rows) {
      const { code, title } = row;
      const menuCategoryCode = code.substring(0,2);
      const children = rows
          .filter(row => row.parent === code)
          .map(row => this.categoryRepository.create({
            code: row.code,
            title: row.title,
            menuCategoryCode
          }));
      const isLeaf = (!children.length);
      const rowData = this.categoryRepository.create({
        code,
        title,
        menuCategoryCode,
        isLeaf,
        children
      });
      insertRows.push(rowData);
    }
    await this.categoryRepository.save(insertRows);
  }

  async findAll() {
    return await this.categoryRepository.findTrees();
  }

  async findOne(code: string): Promise<Category> {
    return await this.categoryRepository.findOne(code);
  }

  async updateIsLeaf(): Promise<boolean> {
    const categories = await this.categoryRepository.find({relations: ['children']});
    const notLeafCategoriesCodes = categories
        .filter(({children}) => children.length)
        .map(({code}) => code);
    const leafCategoriesCodes = categories
        .filter(({children}) => !children.length)
        .map(({ code }) => code);
    await this.categoryRepository.update(notLeafCategoriesCodes, {isLeaf: false});
    await this.categoryRepository.update(leafCategoriesCodes, {isLeaf: true});
    return true;
  }

  async updateMenuCategoryCodes(): Promise<boolean> {
    const categories = await this.categoryRepository.find({relations: ['children']});
    const codes = categories.map(({ code }) => code);
    for (const code of codes) {
      await this.categoryRepository.update(code, {menuCategoryCode: code.substring(0, 2)});
    }
    return true;
  }

  async findRoots() {
    return await this.categoryRepository.findRoots();
  }
}
