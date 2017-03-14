import { OrderBy, SearchType, Query } from '../Common';

import { QueryCategorizeConverterV3 } from './';

/**
 * Helper-class to generate params for the rest-interface url.
 * Only used by Categorize and Find. May in the future do other services too.
 */
export class QueryFindConverterV3 extends QueryCategorizeConverterV3 {

    /**
     * Returns the specific rest-path segment for the Find url,
     * fit for Find V3.
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
