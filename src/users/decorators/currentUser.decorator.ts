/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { PayloadType } from "../types/types";

export const currentUserDecorator = createParamDecorator(
    (data,context:ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user:PayloadType = (request)["user"];
        return user;
        

    }
)