export interface ColumnTable {
    title: string;
    dataProperty: string;
    transform?: (item: any) => string;
}