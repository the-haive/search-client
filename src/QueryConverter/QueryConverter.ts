import { OrderBy, SearchType, Query } from '../Common';

export interface QueryConverter {
    getUrl(baseUrl: string, servicePath: string, query: Query): string;
}
