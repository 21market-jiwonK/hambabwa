import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
  Get,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginRequestDto } from "./dto/login.request.dto";
import { Response } from "express";
import { RequestWithUser, User } from "src/user/entities/user.entity";
import { UserService } from "../user/user.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { CreateUserDto } from "src/user/dto/create-users.dto";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

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
    @Res({ passthrough: true }) res: Response
  ): Promise<User> {
    const userInfo = await this.authService.login(user);

    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtToken(userInfo);
    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(userInfo);

    res.cookie("Authentication", accessToken, accessOption);
    res.cookie("Refresh", refreshToken, refreshOption);

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
  ): Promise<void> {
    const user: User = req.user;
    const { accessOption, refreshOption } =
      this.authService.getCookiesForLogOut();

    await this.userService.removeRefreshToken(user.id);

    res.cookie("Authentication", "", accessOption);
    res.cookie("Refresh", "", refreshOption);

    return;
  }

  @Get("refresh")
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: "refresh 토큰으로 access 토큰 재발급" })
  refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response
  ): User {
    const user = req.user;
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtToken(user);

    res.cookie("Authentication", accessToken, accessOption);

    return user;
  }
}
