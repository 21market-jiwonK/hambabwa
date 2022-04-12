import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import {Menu} from "./entities/menu.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CommonService} from "../common/common.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class MenuService {
  constructor(
      @InjectRepository(Menu)
      private readonly menuRepository: Repository<Menu>,
      private readonly commonService: CommonService,
      private readonly configService: ConfigService
  ) {}

  async create(adminInput: CreateMenuDto, images: Express.Multer.File[]): Promise<Menu> {
    if (images) {
      console.log(images);
      const menuImages = await this.commonService.uploadFiles(images, 'menu');
      let idx = 0;
      for (const key in images) {
        const { fieldname } = images[key][0];
        adminInput[fieldname] = this.configService.get('AWS_S3_IMAGE_URL') + menuImages[idx].Key;
      }
    }

    const newMenu: Menu = await this.menuRepository.create({
      ...adminInput,
      restaurant: { id: adminInput.restaurantId }
    });

    await this.menuRepository.save(newMenu);
    return newMenu;
  }

  findAll() {
    return `This action returns all menu`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
