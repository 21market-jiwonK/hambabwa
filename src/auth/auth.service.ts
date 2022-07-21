import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { UserService } from "../user/user.service";
import { LoginRequestDto } from "./dto/login.request.dto";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      return user;
    }
    const isPasswordValidated: boolean = await bcrypt.compare(
      pass,
      user.password
    );

    if (user && isPasswordValidated) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(data: LoginRequestDto): Promise<User> {
    const { email, password } = data;
    const user = await this.userService.findUserByEmail(email);

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (user && isPasswordValidated) {
      return user;
    }

    throw new UnauthorizedException("이메일과 비밀번호를 확인해주세요.");
  }

  async getCookieWithJwtToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: `${this.configService.get(
        "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
      )}s`,
    });

    return {
      accessToken: token,
      domain: this.configService.get("AUTH_DOMAIN"),
      path: "/",
      httpOnly: true,
      maxAge: this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME") * 1000,
      sameSite: this.configService.get("SAME_SITE_OPTION"),
      secure: true,
    };
  }

  async getCookieWithJwtRefreshToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: `${this.configService.get(
        "JWT_REFRESH_TOKEN_EXPIRATION_TIME"
      )}s`,
    });

    return {
      refreshToken: token,
      domain: this.configService.get("AUTH_DOMAIN"),
      path: "/",
      httpOnly: true,
      maxAge:
        this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME") * 1000,
      sameSite: this.configService.get("SAME_SITE_OPTION"),
      secure: true,
    };
  }

  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: this.configService.get("AUTH_DOMAIN"),
        path: "/",
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: this.configService.get("AUTH_DOMAIN"),
        path: "/",
        httpOnly: true,
        maxAge: 0,
      },
    };
  }
}
