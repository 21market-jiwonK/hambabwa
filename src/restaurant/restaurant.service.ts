import {Injectable} from '@nestjs/common';
import {CreateRestaurantDto} from './dto/create-restaurant.dto';
import {UpdateRestaurantDto} from './dto/update-restaurant.dto';
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {Restaurant} from "./entities/restaurant.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {firstValueFrom} from "rxjs";
import {AxiosResponse} from "axios";
import * as moment from "moment";
import {Menu} from "../menu/entities/menu.entity";
import {CommonService} from "../common/common.service";

@Injectable()
export class RestaurantService {
  constructor(
      @InjectRepository(Restaurant)
      private readonly restaurantRepository: Repository<Restaurant>,
      @InjectRepository(Menu)
      private readonly menuRepository: Repository<Menu>,
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
      private readonly commonService: CommonService
  ) {}

  async create(adminInput: CreateRestaurantDto, image: Express.Multer.File): Promise<Restaurant> {
    const { addr1, addr2 } = adminInput;
    const { Key } = await this.commonService.uploadFile(image, 'restaurant');
    const { data } = await this.getLatLngByAddr(addr1 + ' ' + addr2);
    const newRestaurant: Restaurant = this.restaurantRepository.create({...adminInput,
      lat: data.documents[0].y,
      lng: data.documents[0].x,
      imageUrl: this.configService.get('AWS_S3_IMAGE_URL') + Key
    });

    await this.restaurantRepository.save(newRestaurant);
    return newRestaurant;
  }

  async getLatLngByAddr(addr: string): Promise<AxiosResponse<any>> {
    const path = '/v2/local/search/address';
    const params = new URLSearchParams({query: addr});
    const url = `${this.configService.get('KAKAO_URL')}${path}.json?${params}`;
    const headers = {
      Authorization: 'KakaoAK ' + this.configService.get('KAKAO_KEY')
    }

    return firstValueFrom(await this.httpService.get(url,{headers}));
  }

  async findAll(): Promise<Restaurant[]> {
    return await this.restaurantRepository.find();
  }

  async findOne(id: number): Promise<Restaurant> {
    const today = moment().format('YYYY-MM-DD');
    return await this.restaurantRepository.createQueryBuilder('restaurant')
        .leftJoinAndSelect('restaurant.menus', 'menu')
        .where('restaurant.id = :id', {id})
        .andWhere('menu.servingDate = :date', { date: today })
        .getOne()
  }

  async update(id: number, adminInput: UpdateRestaurantDto): Promise<UpdateResult> {
    return await this.restaurantRepository.update(id, adminInput);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.restaurantRepository.delete(id);
  }
}
