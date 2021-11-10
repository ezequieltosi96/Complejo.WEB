import { isNullOrUndefined } from "src/app/shared/utils/functions.utils";
import { GetAllPagedBaseQuery } from "../base/all-paged-base.query";

export class GetFieldByFilterQuery extends GetAllPagedBaseQuery {

    constructor(public idField: string,
                public idFieldStatus: string,
                public description: string,
                public page: number,
                public size: number) { super(page, size); }

    public getParams(): string {

        let query = '';

        if(!isNullOrUndefined(this.idField)) {
            query = `${query}IdField=${this.idField}&`;
        }

        if(!isNullOrUndefined(this.idFieldStatus)) {
            query = `${query}IdFieldStatus=${this.idFieldStatus}&`;
        }

        if(!isNullOrUndefined(this.description)) {
            query = `${query}Description=${this.description}&`;
        }

        return super.getParams(query);
    }
}