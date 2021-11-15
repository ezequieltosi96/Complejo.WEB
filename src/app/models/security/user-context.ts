
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

    get idClient(): string | undefined | null {
        if(this.tokenDescriptor.idClient)
            return this.tokenDescriptor.idClient;
        
        return null;
    }

    get exp(): number {
        return this.tokenDescriptor.exp;
    }
}