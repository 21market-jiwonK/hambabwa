import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateRestaurantDto} from './dto/create-restaurant.dto';
import {UpdateRestaurantDto} from './dto/update-restaurant.dto';
import {DeleteResult, Repository} from "typeorm";
import {Restaurant} from "./entities/restaurant.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {firstValueFrom} from "rxjs";
import {AxiosResponse} from "axios";
import {Menu} from "../menu/entities/menu.entity";
import {CommonService} from "../common/common.service";
import {ViewMenuWithCategories} from "./entities/v.menu.with.categories.entity";
import {Comment} from "./entities/comment.entity";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {UpdateCommentDto} from "./dto/update-comment.dto";
import {User} from "../user/entities/user.entity";
import {Priority} from "./Priority";
import {ResponseRestaurantDto} from "./dto/response-restaurant.dto";

@Injectable()
export class RestaurantService {
  constructor(
      @InjectRepository(Restaurant)
      private readonly restaurantRepository: Repository<Restaurant>,
      @InjectRepository(Menu)
      private readonly menuRepository: Repository<Menu>,
      @InjectRepository(ViewMenuWithCategories)
      private readonly viewMenuCategoryRepository: Repository<ViewMenuWithCategories>,
      @InjectRepository(Comment)
      private readonly commentRepository: Repository<Comment>,
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
      private readonly commonService: CommonService,
  ) {}

  async create(adminInput: CreateRestaurantDto, image: Express.Multer.File): Promise<Restaurant> {
    const { addr1, addr2 } = adminInput;
    const { Key } = await this.commonService.uploadFile(image, 'restaurant');
    const { data } = await this.getLatLngByAddr(addr1 + ' ' + addr2);
    const newRestaurant: Restaurant = this.restaurantRepository.create({
      ...adminInput,
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

  async findAll(user: User): Promise<Restaurant[]> {
    const unOrderedRestaurants = await this.restaurantRepository.createQueryBuilder('restaurant')
        .distinct(true)
        .innerJoin('restaurants_menus', 'menus', 'menus.restaurantId = restaurant.id')
        .innerJoinAndMapMany('restaurant.menus', 'v_menu_with_categories', 'menusWithCategory', 'menusWithCategory.menuId = menus.menuId')
        .getMany();

    const { orderedRestaurants } = new Priority(unOrderedRestaurants, user);
    return orderedRestaurants;
  }

  async findOne(id: number, user?: User): Promise<ResponseRestaurantDto> {
    const restaurant = await this.restaurantRepository.createQueryBuilder('restaurant')
        .distinct(true)
        .innerJoin('restaurants_menus', 'menus', 'menus.restaurantId = restaurant.id')
        .leftJoinAndSelect('restaurant.comments', 'comment')
        .leftJoin('comment.writer', 'writer')
        .addSelect(['writer.nickname', 'writer.email'])
        // .addSelect(`CASE(writer.nickname) WHEN '${user?.nickname}' THEN TRUE ELSE FALSE END`, 'hasCommented')
        .leftJoinAndMapMany('restaurant.menus', 'v_menu_with_categories', 'menusWithCategory','menusWithCategory.menuId = menus.menuId and menusWithCategory.restaurantId = restaurant.id')
        .leftJoin('user_favorites_menu', 'userFavorite', (user) ? 'userFavorite.userId = :userId and menusWithCategory.menuId = userFavorite.menuId': 'true', {userId: user?.id})
        .leftJoinAndMapOne('menusWithCategory.isFavorite', 'user', 'user', 'user.id = userFavorite.userId')
        .where('restaurant.id = :id', {id})
        .getOne();

    const response = new ResponseRestaurantDto(restaurant);
    if (response.comments?.length) {
      const comments = response.comments;
      response.hasCommented = !!(comments.find(({ writer }) => writer?.email === user?.email));
    }
    return response;
  }

  async update(id: number, { menuIds, ...adminInput }: UpdateRestaurantDto, file: Express.Multer.File): Promise<Restaurant> {
    console.log(menuIds);
    const restaurant = this.restaurantRepository.create({id});
    Object.keys(adminInput).forEach(key => {
      if (adminInput[key]) {
        restaurant[key] = adminInput[key];
      }
    });
    if (file) {
      const { Key } = await this.commonService.uploadFile(file, 'restaurant');
      restaurant.imageUrl = this.configService.get('AWS_S3_IMAGE_URL') + Key;
    }
    if (menuIds.length) {
      restaurant.menus = menuIds.map(menuId => this.menuRepository.create({
        id: menuId
      }));
    }
    return await this.restaurantRepository.save(restaurant);
  }

  async remove(id: number): Promise<DeleteResult> {
    const deleteResult: DeleteResult = await this.restaurantRepository.delete(id);
    await this.updateStars(id);
    return deleteResult;
  }

  async createComment({ restaurantId, writer, ...userInput }: CreateCommentDto):Promise<Comment> {
    const lastComment: Comment = await this.commentRepository.findOne({writer});
    if (lastComment) {
      throw new HttpException('이미 작성한 후기가 존재합니다.', HttpStatus.BAD_REQUEST);
    }

    const newComment = await this.commentRepository.create({
      ...userInput,
      restaurant: { id: restaurantId },
      writer
    });
    await this.commentRepository.save(newComment);
    await this.updateStars(restaurantId);
    return newComment;
  }

  async updateStars(id: number): Promise<void> {
    const { comments } = await this.findOne(id);
    const avgStars = this.calculateStars(comments);
    await this.restaurantRepository.update(id, {stars: avgStars});
  }

  calculateStars(comments: Comment[]) {
    const starsSum = comments
        .map(({stars}) => stars)
        .reduce((sum, curVal) => sum + curVal);
    return starsSum / comments.length;
  }

  async updateComment(id: number, { writer, ...userInput }: UpdateCommentDto): Promise<Comment> {
    const oldComment = await this.commentRepository.findOne(id, {relations: ['restaurant', 'writer']});
    if (oldComment.writer.email !== writer.email) {
      throw new HttpException('작성자만 수정 가능합니다.', HttpStatus.BAD_REQUEST);
    }

    const newComment = await this.commentRepository.create({
      id,
      ...userInput,
    });
    await this.commentRepository.save(newComment);
    await this.updateStars(oldComment.restaurant.id);
    return newComment;
  }

  async removeComment(id: number): Promise<DeleteResult> {
    return await this.commentRepository.delete(id);
  }
}
