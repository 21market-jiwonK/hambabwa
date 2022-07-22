import {Controller, Get, Query, Req, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import {RequestWithUser} from "../auth/requestWithUser.interface";
import {SearchMyDto} from "./dto/search-my.dto";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(
      private readonly userService: UserService
  ) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "본인정보 조회" })
  async getProfile(@Req() req) {
    req.user.password = undefined;
    req.user.currentHashedRefreshToken = undefined;
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
