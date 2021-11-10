import { AbstractCreateUpdateFieldCommand } from "./base/abstract-create-update-field.command";

export class CreateFieldCommand extends AbstractCreateUpdateFieldCommand {

    constructor(public description: string,
                public idFieldType: string,
                public idFieldStatus: string) { super(description, idFieldType, idFieldStatus); }

}