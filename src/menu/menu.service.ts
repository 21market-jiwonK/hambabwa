import { Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { Menu } from "./entities/menu.entity";
import {DeleteResult, In, Repository} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonService } from "../common/common.service";
import { ConfigService } from "@nestjs/config";
import { CreateMenuFileDto } from "./dto/create-menu-file.dto";
import { CreateMenuExcelDto } from "./dto/create-menu-excel.dto";
import {CategoryService} from "../category/category.service";

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    { categoryCode, ...adminInput }: CreateMenuDto,
    file: Express.Multer.File
  ): Promise<Menu> {
    const { url: imageUrl } = await this.uploadMenuImage(file);
    const category = await this.categoryService.findOne(categoryCode);
    const newMenu: Menu = this.menuRepository.create({
      ...adminInput,
      category,
      imageUrl,
    });
    await this.menuRepository.save(newMenu);
    return newMenu;
  }

  async uploadMenuImage(file: Express.Multer.File): Promise<CreateMenuFileDto> {
    const { originalname, mimetype } = file;
    const { Key } = await this.commonService.uploadFile(file, "menu");
    const url = this.configService.get("AWS_S3_IMAGE_URL") + Key;
    return new CreateMenuFileDto(Key, url, originalname, mimetype);
  }

  async findAll(): Promise<Menu[]> {
    return await this.menuRepository.find({
      relations: ["category"],
    });
  }

  async update(id: number, adminInput: UpdateMenuDto): Promise<Menu> {
    const update = this.menuRepository.create({ id, ...adminInput });
    return await this.menuRepository.save(update);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.menuRepository.delete(id);
  }

  async updateMenuImageUrl(file: Express.Multer.File): Promise<void> {
    const rows: CreateMenuExcelDto[] = this.commonService.uploadExcel(file);
    for (const row of rows) {
      const { code, url } = row;
      const menus = await this.menuRepository
        .createQueryBuilder("menu")
        .where("LEFT(menu.categoryCode, 5) = :code", { code })
        .getMany();
      const menuIds = menus.map((menu) => menu.id);
      await this.menuRepository.update(menuIds, { imageUrl: url });
    }
    return;
  }

  async findMenusByRootCategoryCode(code: string): Promise<Menu[]> {
    return await this.menuRepository.find({
      isRepresentative: "Y",
      menuCategoryCode: code
    });
  }

  async updateMenuCategoryCode(): Promise<boolean> {
    const menus = await this.menuRepository.find({relations: ['category']});
    for (const menu of menus) {
      const { id, category } = menu;
      await this.menuRepository.update(id, {menuCategoryCode: category.menuCategoryCode});
    }
    return true;
  }

  async findMenusByIds(ids: number[]): Promise<Menu[]> {
    return await this.menuRepository.find({where: {id: In(ids)}});
  }
}
