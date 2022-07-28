import {HttpException, HttpStatus, Injectable, UnauthorizedException,} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-users.dto";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import {MyList, SearchMyDto} from "./dto/search-my.dto";
import {CreateFavoritesDto} from "./dto/create-favorites.dto";
import {MenuService} from "../menu/menu.service";
import {UpdateFavoritesDto} from "./dto/update-favorites.dto";
import { CommonService } from "src/common/common.service";
import { ConfigService } from "@nestjs/config";
import { UpdateUsersDto } from "./dto/update-users.dto";
import {Menu} from "../menu/entities/menu.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly menuService: MenuService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.password = bcrypt.hashSync(user.password, 10);
    return await this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      "User with this email does not exist",
      HttpStatus.NOT_FOUND
    );
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      "User with this id does not exist",
      HttpStatus.NOT_FOUND
    );
  }

  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    return await this.userRepository.update(id, { currentHashedRefreshToken });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.findUserById(id);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException("Not found user for refresh token.");
    }
    return user;
  }

  async removeRefreshToken(id: number) {
    return await this.userRepository.update(id, {
      currentHashedRefreshToken: null,
    });
  }

  async findMyLists({ writer, getType }: SearchMyDto): Promise<User> {
    switch (getType) {
      case MyList.COMMENT:
        return await this.findMyComments(writer.id);
      case MyList.FAVORITE:
        return await this.findMyFavorites(writer.id);
    }
  }

  async findMyFavorites(id: number): Promise<User> {
    return await this.userRepository.createQueryBuilder('my')
        .where('my.id = :id', {id})
        .leftJoinAndSelect('my.favorites', 'favorites')
        .getOne();
  }

  async findMyComments(id: number): Promise<User> {
    return await this.userRepository.createQueryBuilder('my')
        .where('my.id = :id', {id})
        .leftJoinAndSelect('my.comments', 'comments')
        .getOne();
  }

  async setMyFavorites(createFavoritesDto: CreateFavoritesDto): Promise<User> {
    const { user, menuIds } = createFavoritesDto;
    let { favorites } = await this.findMyFavorites(user.id);
    const newFavoriteMenus: Menu[] = await this.menuService.findMenusByIds(menuIds);
    newFavoriteMenus.forEach(menu => favorites.push(menu));
    const userWithFavorites = this.userRepository.create({
      id: user.id,
      favorites,
    });
    await this.userRepository.save(userWithFavorites);
    return await this.findMyFavorites(user.id);
  }

  async updateFavorites(updateFavoritesDto: UpdateFavoritesDto): Promise<User> {
    const { user, menuId } = updateFavoritesDto;
    let { favorites } = await this.findMyFavorites(user.id);
    const isExist = favorites.find(({ id }) => id === menuId);
    if (isExist)
      favorites = favorites.filter(({ id }) => id !== menuId);
    else {
      const [newFavorite] = await this.menuService.findMenusByIds([menuId]);
      favorites.push(newFavorite);
    }

    const userWithFavorites = this.userRepository.create({
      id: user.id,
      favorites
    });
    await this.userRepository.save(userWithFavorites);
    return await this.findMyFavorites(user.id);
  }

  async updateProfile(user: User, userInput: UpdateUsersDto, file?: Express.Multer.File) {
    user.nickname = userInput.nickname;
    if (file) {
      const { Key } = await this.commonService.uploadFile(file, 'profile');
      user.imageUrl = this.configService.get('AWS_S3_IMAGE_URL') + Key;
    }
    return await this.userRepository.save(user);
  }

  async resetMyFavorites(user: User): Promise<User> {
    const userWithZeroFavorites = this.userRepository.create({
      id: user.id,
      favorites: []
    });
    await this.userRepository.save(userWithZeroFavorites);
    return await this.findMyFavorites(user.id);
  }
}
