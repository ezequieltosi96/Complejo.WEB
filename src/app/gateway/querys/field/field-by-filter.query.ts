import { isNullOrUndefined } from "src/app/shared/utils/functions.utils";
import { GetAllPagedBaseQuery } from "../base/all-paged-base.query";

export class GetFieldByFilterQuery extends GetAllPagedBaseQuery {

    constructor(public idFieldType: string | null,
                public idFieldStatus: string | null,
                public description: string | null,
                public page: number,
                public size: number) { super(page, size); }

    public getParams(): string {

        let query = '';

        if(!isNullOrUndefined(this.idFieldType)) {
            query = `${query}IdFieldType=${this.idFieldType}&`;
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