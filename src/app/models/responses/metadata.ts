export class Metadata {

    constructor(public totalCount: number,
                public pageSize: number,
                public currentPage: number,
                public totalPages: number,
                public hasNextPage: boolean,
                public hasPreviousPage: boolean,
                public nextPageNumber?: number,
                public previousPageNumber?: number) { }

}