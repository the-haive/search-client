import { OrderBy, SearchType, Query } from '../Common';

import { QueryCategorizeConverterV3 } from './';

/**
 * Class to handle creating find lookups for restservice version 3.
 */
export class QueryFindConverterV3 extends QueryCategorizeConverterV3 {

    /**
     * Returns the specific rest-path segment for the Find url,
     * fit for Find V3.
     */
    protected getUrlParams(query: Query): string[] {
        let params = super.getUrlParams(query);
        
        this.addParamIfSet(params, 'g', query.matchGrouping);
        this.addParamIfSet(params, 'o', OrderBy[query.matchOrderBy]);
        this.addParamIfSet(params, 'p', query.matchPage);
        this.addParamIfSet(params, 's', query.matchPageSize);

        return params;
    }

}
