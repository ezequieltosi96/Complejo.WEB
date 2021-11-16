import { AbstractCreateUpdateFieldCommand } from "./base/abstract-create-update-field.command";

export class UpdateFieldCommand extends AbstractCreateUpdateFieldCommand {

    constructor(public idField: string,
                public description: string,
                public idFieldType: string,
                public idFieldStatus: string,
                public price: number) { super(description, idFieldType, idFieldStatus, price); }

}