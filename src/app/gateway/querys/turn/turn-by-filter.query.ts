import { isNullOrUndefined } from "src/app/shared/utils/functions.utils";
import { GetAllPagedBaseQuery } from "../base/all-paged-base.query";

export class GetTurnByFilterQuery extends GetAllPagedBaseQuery {

    constructor(public date: Date | null,
                public time: string | null,
                public idFieldType: string | null,
                public clientSearchCriteria: string | null,
                public page: number,
                public size: number) { super(page, size); }

    public getParams(): string {

        let query = '';

        if(!isNullOrUndefined(this.idFieldType)) {
            query = `${query}IdFieldType=${this.idFieldType}&`;
        }

        if(!isNullOrUndefined(this.date)) {
            query = `${query}Date=${this.date}&`;
        }

        if(!isNullOrUndefined(this.time)) {
            query = `${query}Time=${this.time}&`;
        }

        if(!isNullOrUndefined(this.clientSearchCriteria)) {
            query = `${query}ClientSearchCriteria=${this.clientSearchCriteria}&`;
        }

        return super.getParams(query);
    }
}