import {HttpException, HttpStatus, Injectable, UnauthorizedException,} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-users.dto";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import {MyList, SearchMyDto} from "./dto/search-my.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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

  async findMyLists({ writer, ...userInput }: SearchMyDto) {
    const { type } = userInput;
    let qb = this.userRepository.createQueryBuilder('my')
        .where('my.id = :id', {id: writer.id});
    switch (type) {
      case MyList.COMMENT:
        return await qb
            .leftJoinAndSelect('my.comments', 'comments')
            .getOne();
      case MyList.FAVORITE:
        return await qb
            .leftJoinAndSelect('my.favorites', 'favorites')
            .getOne();
    }
  }
}
