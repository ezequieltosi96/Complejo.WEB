import { Metadata } from "./metadata";

export class PagedListResponse<T> {

    constructor(public data: T, public metadata: Metadata) {}

}