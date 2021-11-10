import jwt_decode from "jwt-decode";
import { JwtTokenDescriptor } from "./jwt-token-descriptor";

export const decodeToken = (token: string) : JwtTokenDescriptor => {
    return jwt_decode<JwtTokenDescriptor>(token);
}