export class JwtTokenDescriptor {
    constructor(public readonly sub: string,
                public readonly jti: string,
                public readonly email: string,
                public readonly uid: string,
                public readonly roles: string[],
                public readonly exp: number,
                public readonly isAdmin: string,
                public readonly idClient: string | null | undefined) {}
}