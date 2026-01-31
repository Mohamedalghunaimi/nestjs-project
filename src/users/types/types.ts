/* eslint-disable prettier/prettier */
import { UserType } from '../../utilts/enum';

export type PayloadType = {
  email: string;
  userType: UserType;
  id:string
};


export type accessTokenType = {
  accessToken:string
}