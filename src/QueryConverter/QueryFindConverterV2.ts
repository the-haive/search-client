import { OrderBy, SearchType, Query } from '../Common';

import { QueryCategorizeConverterV2 } from './';

/**
 * Class to handle creating find lookups for restservice version 2.
 */
export class QueryFindConverterV2 extends QueryCategorizeConverterV2 {

    /**
     * Converts the query params to an array of key=value segments,
     * fit for Find V2.
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
