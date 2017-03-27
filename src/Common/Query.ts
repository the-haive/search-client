import moment from 'moment/moment';

import { OrderBy } from './OrderBy';
import { SearchType } from './SearchType';
import { Filter } from './Filter';

/**
 * Represents a datespecification that can either be fixed or a delta from now.
 * If the date is a moment DurationInputObject we calulcate the date in realtime when the fetch-call is executed. 
 * Note that the value must be an object with properties and values. I.e. { M: -1 } // One month ago
 * See http://momentjs.com/docs/#/durations/.
 * Otherwise we assume that the value is a fixed value that the moment library can parse without any helping formatting 
 * strings. See http://momentjs.com/docs/#/parsing/string/.
 */
export type DateSpecification = Date | string | number | moment.DurationInputObject;

export class Query {

    /**
     * Any string that you want to identify the client with. Can be used in the catgegories configuration and in the relevance tuning.
     */
    public clientId: string = '';

    /**
     * Used to specify the start date-range.
     */
    public dateFrom: DateSpecification = null;

    /**
     * Used to specify the end date-range.
     */
    public dateTo: DateSpecification = null;

    /**
     * Use one of this query parameter to specify the filters to apply. Each filter should contain its group name 
     * followed by category names, representing complete hierarchy of the category. The names specified here is derived from category Name 
     * property and not its display name. When specifying multiple filters, separate them either by comma or semicolon. 
     * For example: &f=Authors|Sam;FileTypes|docx
     * Note the above names are case sensitive.
     */
    public filters: Filter[] = [];
    //public filters: string[] = [];

    /**
     * Decides whether or not to use the parent-grouping feature to group results. 
     */
    public matchGrouping: boolean = false;

    /**
     * Decides which ordering algorithm to use.
     */
    public matchOrderBy: OrderBy = OrderBy.Relevance;

    /**
     * The actual page to fetch. The numbering is zero-based and expects a non-negative number. 
     */
    public matchPage: number = 0;

    /**
     * The number of results per page to fetch. Expects a positive integer value. 
     */
    public matchPageSize: number = 10;

    /**
     * The maximum number of query-suggestions to fetch.
     */
    public maxSuggestions: number = 10;

    /**
     * The queryText that is to be used for autocomplete/find/categorize.
     */
    public queryText: string = '';

    /**
     * The type of search to perform. 
     */
    public searchType: SearchType = SearchType.Keywords;

    /**
     * Creates a Query object for you, based on Query defaults and the overrides provided as a param.
     * 
     * @param query - The query defined here will override the default Query.
     */
    constructor(query?: Query) {
        Object.assign(this, query);
    }

}
