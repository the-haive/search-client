import * as moment from 'moment/moment';

import { OrderBy, SearchType, Query } from '../Common';

import { QueryConverter } from './';

export class QueryCategorizeConverterV2 implements QueryConverter {

    /**
     * Returns the url for version 2 of the REST API.
     * 
     * @param baseUrl is the leading part of the url that is to be generated.
     * @param queyr is the query that is to be converted into the url.
     */
    public getUrl(baseUrl: string, query: Query): string {
        let params = this.getUrlParams(query).sort();
        let sep = baseUrl.endsWith("/") ? "" : "/";
        return `${baseUrl}${sep}${encodeURIComponent(query.queryText)}?${params.join('&')}`;
    }

    /**
     * Converts the query params to an array of key=value segments,
     * fit for Categorize V2.
     */
    protected getUrlParams(query: Query): string[] {
        let params = [];

        if (query.searchType != null) {
            params.push(`t=${encodeURIComponent(SearchType[query.searchType])}`);
        }

        if (query.filters.length > 0) {
            params.push(`f=${encodeURIComponent(query.filters.join(';'))}`);
        }

        if (query.clientId) {
            params.push(`c=${encodeURIComponent(query.clientId)}`);
        }

        return params;
    }

}
