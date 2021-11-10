
import { decodeToken } from "./jwt-decode";
import { JwtTokenDescriptor } from "./jwt-token-descriptor";

export class UserContext {

    private readonly tokenDescriptor: JwtTokenDescriptor;

    constructor(private readonly token: string) {
        this.tokenDescriptor = decodeToken(token);
    }

    get idUser(): string {
        return this.tokenDescriptor.uid;
    }

    get userName(): string {
        return this.tokenDescriptor.sub;
    }

    get email(): string {
        return this.tokenDescriptor.email;
    }

    get role(): string {
        return this.tokenDescriptor.roles.toString();
    }

    get isAdmin(): boolean {
        return this.tokenDescriptor.isAdmin === "True";
    }
}