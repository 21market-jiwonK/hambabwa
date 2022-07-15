import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import {Menu} from "./entities/menu.entity";
import {DeleteResult, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CommonService} from "../common/common.service";
import {ConfigService} from "@nestjs/config";
import {CreateMenuFileDto} from "./dto/create-menu-file.dto";

@Injectable()
export class MenuService {
  constructor(
      @InjectRepository(Menu)
      private readonly menuRepository: Repository<Menu>,
      private readonly commonService: CommonService,
      private readonly configService: ConfigService,
  ) {}

  async create(adminInput: CreateMenuDto, file: Express.Multer.File): Promise<Menu> {
    const { url: imageUrl } = await this.uploadMenuImage(file);
    const newMenu: Menu = this.menuRepository.create({
      ...adminInput,
      imageUrl,
    });
    await this.menuRepository.save(newMenu);
    return newMenu;
  }

  async uploadMenuImage(file: Express.Multer.File): Promise<CreateMenuFileDto> {
    const { originalname, mimetype } = file;
    const { Key } = await this.commonService.uploadFile(file, 'menu');
    const url = this.configService.get('AWS_S3_IMAGE_URL') + Key;
    return new CreateMenuFileDto(Key, url, originalname, mimetype);
  }

  async findAll(): Promise<Menu[]> {
    return await this.menuRepository.find({
      relations: ['category']
    });
  }

  async update(id: number, adminInput: UpdateMenuDto): Promise<Menu> {
    const update = this.menuRepository.create({id,
      ...adminInput
    });
    return await this.menuRepository.save(update);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.menuRepository.delete(id);
  }
}
