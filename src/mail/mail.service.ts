import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {User} from "../user/entities/user.entity";

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService
    ) {}

    async sendUserWelcomeMail(user: User): Promise<void> {
        try {
            console.log(user);
            await this.mailerService.sendMail({
                to: user.email,
                subject: '강남함바 가입을 축하드립니다!',
                template: './confirmation',
                context: {
                    name: user.nickname,
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
}
