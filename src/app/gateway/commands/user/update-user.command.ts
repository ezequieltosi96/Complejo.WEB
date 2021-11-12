import { AbstractCreateUpdateUserCommand } from "./base/abstract-create-update-user.command";

export class UpdateUserCommand extends AbstractCreateUpdateUserCommand {

    constructor(public email: string,
                public firstName: string,
                public lastName: string,
                public roleName: string,
                public id: string) { super(email, firstName, lastName, roleName); }

}