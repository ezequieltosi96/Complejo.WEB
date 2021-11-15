export class RegistrationRequest {
    constructor(public firstName: string,
                public lastName: string,
                public email: string,
                public password: string,
                public roleName: string,
                public dni: string,
                public phoneNumber: string) {}
}