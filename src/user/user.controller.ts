import {Controller, Get, Query, Req, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import {SearchMyDto} from "./dto/search-my.dto";
import {RequestWithUser, User} from "./entities/user.entity";

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
  ) {
    filter.writer = user;
    return await this.userService.findMyLists(filter);
  }
}
