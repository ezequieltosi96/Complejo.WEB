import { isNullOrUndefined } from "src/app/shared/utils/functions.utils";

export class GetAllBaseQuery {

    constructor(public idEntity: string | null) {}
    
    protected getParams(query: string): string {

        if(!isNullOrUndefined(this.idEntity)) {
            query = `?${query}IdEntity=${this.idEntity}`;
        }

        return query;
    }
}