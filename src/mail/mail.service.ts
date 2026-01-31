/* eslint-disable prettier/prettier */
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";

@Injectable()
export class MailService {

    constructor(private readonly mailerService:MailerService) {}


    public async sendEmail(email:string,subject:string) {
        try {
            const date = new Date()
            await this.mailerService.sendMail({
                to:email,
                from:"mohammednabil.com",
                subject,
                template:"login",
                context:{date,email}

            })
        } catch (error) {
            console.log(error)
            throw new RequestTimeoutException()
        }

    }

    public async verifyEmail(link:string,email:string) {
        try {
            await this.mailerService.sendMail({
                to:email,
                from:"mohammednabil.com",
                subject:"verify-email",
                template:"verify-email",
                context:{link}
            })
        } catch (error) {
            console.log(error)
            throw new RequestTimeoutException()
        }
    }


    public async sendResetPasswordTemplate(email:string,link:string) {
        try {
            await this.mailerService.sendMail({
                to:email,
                from:"mohammednabil.com",
                subject:"reset-password",
                template:"reset-password",
                context:{link}
            })
        } catch (error) {
            console.log(error)
            throw new RequestTimeoutException()
        }

    }

}