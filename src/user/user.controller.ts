import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-users.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @ApiOperation({ summary: "본인정보 조회" })
  async getProfile(@Req() req) {
    req.user.password = undefined;
    req.user.currentHashedRefreshToken = undefined;
    return req.user;
  }
}
