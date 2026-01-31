/* eslint-disable prettier/prettier */
import { MailerModule } from "@nestjs-modules/mailer";
import {  Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "./mail.service";
import { join } from "path";
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({

    imports :[
        MailerModule.forRootAsync(
            
            {
                inject:[ConfigService],
                useFactory:(config:ConfigService)=> {
                    return {
                        
                        transport :{
                            host:config.get<string>("HOST"),
                            port:config.get<number>("SMTP_PORT"),
                            secure:false,
                            auth:{
                                user:config.get<string>("USERNAME"),
                                pass:config.get<string>("PASSWORD")
                            }
                        },
                        template :{
                            dir:join(__dirname,"templates"),
                            adapter:new EjsAdapter(
                                {
                                    inlineCssEnabled:true
                                }
                            )


                        }
                    }
                }
            }
        ),
    ],
    controllers :[

    ],
    providers:[MailService],
    exports:[MailService]

})
export class MailModule {

}