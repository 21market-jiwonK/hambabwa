import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import {MenuModule} from "../menu/menu.module";
import {MailModule} from "../mail/mail.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      MenuModule,
      MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
