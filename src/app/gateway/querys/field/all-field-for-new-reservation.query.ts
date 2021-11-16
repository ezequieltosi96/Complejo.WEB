import { isNullOrUndefined } from "src/app/shared/utils/functions.utils";

export class GetAllFieldForNewReservationQuery {
    constructor(public idFieldType: string,
                public date: Date,
                public time: string) {}

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

        return `?${query}`;
    }
}