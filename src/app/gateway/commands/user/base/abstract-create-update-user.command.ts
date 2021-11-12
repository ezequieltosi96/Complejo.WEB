export abstract class AbstractCreateUpdateUserCommand {

    constructor(public email: string,
                public firstName: string,
                public lastName: string,
                public roleName: string) { }
                
}