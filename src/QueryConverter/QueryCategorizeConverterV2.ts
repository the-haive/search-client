import * as moment from 'moment/moment';

import { OrderBy, SearchType, Query } from '../Common';

import { QueryBaseConverter, QueryConverter } from './';

/**
 * Class to handle creating categorize lookups for restservice version 2.
 */
export class QueryCategorizeConverterV2 extends QueryBaseConverter implements QueryConverter {

    /**
     * Returns the url for version 2 of the REST API.
     * 
     * @param baseUrl is the leading part of the url that is to be generated.
     * @param queyr is the query that is to be converted into the url.
     */
    public getUrl(baseUrl: string, servicePath: string, query: Query): string {
        let params = this.getUrlParams(query).sort();
        baseUrl = baseUrl.replace(/\/+$/, "");
        servicePath = servicePath.replace(/(^\/+)|(\/+$)/g, "");
        return `${baseUrl}/${servicePath}/${encodeURIComponent(query.queryText)}?${params.join('&')}`;
    }

    /**
     * Converts the query params to an array of key=value segments,
     * fit for Categorize V2.
     */
    protected getUrlParams(query: Query): string[] {
        let params: string[] = [];

        // Note: Not adding queryText here, as in v2 that is added in the getUrl call above.
        this.addParamIfSet(params, 'c', query.clientId);
        let filters: string[] = query.filters.map((f) => f.category.categoryName.join('|'));
        this.addParamIfSet(params, 'f', filters.join(';'));
        this.addParamIfSet(params, 't', SearchType[query.searchType]);

        return params;
    }

}
