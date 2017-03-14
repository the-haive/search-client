import { OrderBy, SearchType, Query } from '../Common';

export interface QueryConverter {
    getUrl(baseUrl: string, query: Query): string;
}
