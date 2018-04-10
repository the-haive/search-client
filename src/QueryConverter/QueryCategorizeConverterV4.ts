import * as moment from 'moment/moment';

import { OrderBy, SearchType, Query } from '../Common';

import { QueryCategorizeConverterV3 } from './';

/**
 * Class to handle creating categorize lookups for restservice version 4.
 * Note: This is just a dummy class, as v4 has no new features for the Categorize call.
 */
export class QueryCategorizeConverterV4 extends QueryCategorizeConverterV3 {

    /**
     * Converts the query params to an array of key=value segments,
     * fit for Categorize V3.
     */
    protected getUrlParams(query: Query): string[] {
        let params: string[] = super.getUrlParams(query);
        this.addParamIfSet(params, 'l', query.uiLanguageCode);

        return params;
    }

}
