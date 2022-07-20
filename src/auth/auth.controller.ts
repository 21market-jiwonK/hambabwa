import { Controller, Post, UseGuards, Body, Res, Req } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginRequestDto } from "./dto/login.request.dto";
import { Request, Response } from "express";
import { User } from "src/user/entities/user.entity";
import { UserService } from "../user/user.service";
import { LocalAuthGuard } from "./guards/local-auth.gurad";
import { CreateUserDto } from "src/user/dto/create-users.dto";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { RequestWithUser } from "./requestWithUser.interface";

@Controller("auth")
@ApiTags("Web-Auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post("signup")
  @ApiOperation({ summary: "회원가입" })
  async register(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.signup(user);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequestDto })
  @ApiOperation({ summary: "로그인" })
  async login(
    @Body() user: LoginRequestDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<User> {
    const userInfo = await this.authService.login(user);

    const { accessToken, ...accessOption } =
      await this.authService.getCookieWithJwtToken(userInfo);
    const { refreshToken, ...refreshOption } =
      await this.authService.getCookieWithJwtRefreshToken(userInfo);

    response.cookie("Authentication", accessToken, accessOption);
    response.cookie("Refresh", refreshToken, refreshOption);

    await this.userService.setCurrentRefreshToken(refreshToken, userInfo.id);

    userInfo.password = undefined;
    userInfo.currentHashedRefreshToken = undefined;

    return userInfo;
  }

  @Post("logout")
  @ApiOperation({ summary: "로그아웃" })
  @UseGuards(JwtRefreshGuard)
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response
  ): Promise<User> {
    const user: User = req.user;
    const { accessOption, refreshOption } =
      this.authService.getCookiesForLogOut();

    await this.userService.removeRefreshToken(user.id);

    res.cookie("Authentication", "", accessOption);
    res.cookie("Refresh", "", refreshOption);

    user.password = undefined;
    user.currentHashedRefreshToken = undefined;

    return user;
  }
}
