export class GetAllPagedBaseQuery {

    constructor(public page: number,
                public size: number) {}

    protected getParams(query: string): string {

        query = `?${query}Size=${this.size}&Page=${this.page}`;

        return query;
    }
}