export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface PaginationOptions {
  skip: number;
  size: number;
  sort?: Record<string, number>;
}
