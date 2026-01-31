/* eslint-disable prettier/prettier */
import { UserType } from 'src/utilts/enum';

export type PayloadType = {
  email: string;
  userType: UserType;
  id:string
};


export type accessTokenType = {
  accessToken:string
}