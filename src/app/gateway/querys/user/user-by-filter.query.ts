import { isNullOrUndefined } from "src/app/shared/utils/functions.utils";
import { GetAllPagedBaseQuery } from "../base/all-paged-base.query";

export class GetUserByFilterQuery extends GetAllPagedBaseQuery {

    constructor(public searchCriteria: string | null,
                public page: number,
                public size: number) { super(page, size); }

    public getParams(): string {

        let query = '';

        if(!isNullOrUndefined(this.searchCriteria)) {
            query = `${query}SearchCriteria=${this.searchCriteria}&`;
        }

        return super.getParams(query);
    }
}