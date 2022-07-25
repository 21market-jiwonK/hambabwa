import {Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import {SearchMyDto} from "./dto/search-my.dto";
import {RequestWithUser, User} from "./entities/user.entity";
import {CreateFavoritesDto} from "./dto/create-favorites.dto";
import {UpdateFavoritesDto} from "./dto/update-favorites.dto";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(
      private readonly userService: UserService
  ) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "본인정보 조회" })
  async getProfile(
      @Req() req
  ): Promise<User> {
    return req.user;
  }

  @Get("profile/list")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "my page > 내가 쓴 후기 / 내가 좋아하는 메뉴 조회 API" })
  async getMyLists(
    @Req() { user }: RequestWithUser,
    @Query() filter: SearchMyDto
  ): Promise<any> {
    filter.writer = user;
    return await this.userService.findMyLists(filter);
  }

  @Post("profile/list")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "내가 좋아하는 메뉴 최초 설정 및 다시하기(초기화 후 재설정) API" })
  async setMyFavorites(
    @Req() { user }: RequestWithUser,
    @Body() userInput: CreateFavoritesDto
  ) {
    userInput.user = user;
    return await this.userService.setMyFavorites(userInput);
  }

  @Patch("profile/list/:menuId")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "내가 좋아하는 메뉴 추가 / 삭제 하기" })
  async addOrDeleteMyFavorites(
    @Req() { user }: RequestWithUser,
    @Param('menuId') menuId: number,
    @Body() userInput: UpdateFavoritesDto
  ) {
    userInput.user = user;
    userInput.menuId = menuId;
    return await this.userService.updateFavorites(userInput);
  }
}
