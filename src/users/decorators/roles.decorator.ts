/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";
import { UserType } from "src/utilts/enum";


export const Roles = (...roles: UserType[]) => {
    return SetMetadata("roles",roles);
}