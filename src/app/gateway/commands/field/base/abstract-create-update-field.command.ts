export abstract class AbstractCreateUpdateFieldCommand {

    constructor(public description: string,
                public idFieldType: string,
                public idFieldStatus: string) { }
                
}