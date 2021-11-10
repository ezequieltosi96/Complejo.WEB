export class GetAllBaseQuery {

    constructor(public idEntity: string) {}
    
    protected getParams(query: string): string {

        query = `?${query}IdEntity=${this.idEntity}`;

        return query;
    }
}