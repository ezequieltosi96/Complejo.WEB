import { isNullOrUndefined } from "src/app/shared/utils/functions.utils";

export class GetAllAvailableFieldByDateTimeQuery {
    constructor(public date: Date | null,
                public time: string | null) { }

    public getParams(): string {

        let query = '';
        if(!isNullOrUndefined(this.date)) {
            query = `${query}Date=${this.date}&`;
        }

        if(!isNullOrUndefined(this.time)) {
            query = `${query}Time=${this.time}&`;
        }

        return `?${query}`;
    }
}