import { AbstractCreateUpdateUserCommand } from "./base/abstract-create-update-user.command";

export class CreateUserCommand extends AbstractCreateUpdateUserCommand {

    constructor(public email: string,
                public firstName: string,
                public lastName: string,
                public roleName: string) { super(email, firstName, lastName, roleName); }

}