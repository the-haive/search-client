import { OrderBy, SearchType, Query } from '../Common';

import { QueryCategorizeConverterV2 } from './';

/**
 * Helper-class to generate params for the rest-interface url.
 * Only used by Categorize and Find. May in the future do other services too.
 */
export class QueryFindConverterV2 extends QueryCategorizeConverterV2 {

    /**
     * Converts the query params to an array of key=value segments,
     * fit for Find V2.
     */
    protected getUrlParams(query: Query): string[] {
        let params = super.getUrlParams(query);
        
        if (query.matchPageSize) {
            params.push(`s=${encodeURIComponent(query.matchPageSize.toString())}`);
        }

        if (query.matchPage) {
            params.push(`p=${encodeURIComponent(query.matchPage.toString())}`);
        }

        if (query.matchGrouping) {
            params.push(`g=${encodeURIComponent(query.matchGrouping.toString())}`);
        }

        if (query.matchOrderBy != null) {
            params.push(`o=${encodeURIComponent(OrderBy[query.matchOrderBy])}`);
        }

        return params;
    }

}
