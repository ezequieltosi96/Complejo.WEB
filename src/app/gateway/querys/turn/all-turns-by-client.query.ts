import { isNullOrUndefined } from "src/app/shared/utils/functions.utils";
import { GetAllPagedBaseQuery } from "../base/all-paged-base.query";

export class GetAllTurnsByClientQuery extends GetAllPagedBaseQuery {

    constructor(public idClient: string,
                public page: number,
                public size: number) { super(page, size); }

    public getParams(): string {

        let query = '';

        if(!isNullOrUndefined(this.idClient)) {
            query = `${query}IdClient=${this.idClient}&`;
        }

        return super.getParams(query);
    }
}