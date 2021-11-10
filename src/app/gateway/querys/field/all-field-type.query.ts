import { GetAllBaseQuery } from "../base/all-base.query";

export class GetAllFieldTypeQuery extends GetAllBaseQuery {

    constructor(public idEntity: string) { super(idEntity); }
    
    public getParams(): string {
        return super.getParams('');
    }
}