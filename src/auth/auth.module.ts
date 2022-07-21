import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./strategies/local.strategy";
import { UserModule } from "src/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { ConfigService } from "@nestjs/config";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_TOKEN_SECRET"),
        signOptions: {
          expiresIn: `${configService.get(
            "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
          )}s`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtRefreshStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
