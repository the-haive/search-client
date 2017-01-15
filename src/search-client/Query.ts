import SearchType from './SearchType';
import Filters from './Filters';
import Order from './Order';

/**
 * Defines the query parameters for the various API calls (find, categorize, bestBets, autocomplete, ...)
 * 
 * @export
 * @interface Query
 */
export interface Query{
    /**
     * The text to search for.
     * @default Empty
     */
    query?: string;

    /**
     * The type of search to perform. Allowed values: "Keywords", "Relevance". 
     * @default ISearchType.Keywords
     */
    searchType?: SearchType;

    /**
     * Use one of this query parameter to specify the filters to apply. Each filter should contain its group name 
     * followed by category names, representing complete hierarchy of the category. The names specified here is derived from category Name 
     * property and not its display name. When specifying multiple filters, separate them either by comma or semicolon. 
     * For example: &f=Authors|Sam;FileTypes|docx
     * Note the above names are case sensitive.
     * @default Empty (no filter set)
     */
    filters?: Filters;

    /**
     * Used to specify the "from datetime" of a date-range filter. 
     * Expects an ISO 8601 datetime as a string. See https://en.wikipedia.org/wiki/ISO_8601 for details.
     * @default Empty (not set, in effect meaning that items will be returned no matter how **old** they are)
     */
    dateFrom?: Date;

    /**
     * Used to specify the "to datetime" of a date-range filter. 
     * Expects an ISO 8601 datetime as a string. See https://en.wikipedia.org/wiki/ISO_8601 for details.
     * @default Empty (not set, in effect meaning that items will be returned no matter how **new** they are)
     */
    dateTo?: Date;

    /**
     * Any string that you want to identify the client with. Can be used in the catgegories configuration and in the relevance tuning.
     * @default Empty
     */
    clientId?: string;

    /**
     * The number of results per page to fetch. Expects a positive integer value. 
     * @default 10
     */
    pageSize?: number;

    /**
     * The actual page to fetch. The numbering is zero-based and expects a non-negative number. 
     * @default 0 (first page)
     */
    page?: number;

    /**
     * Decides whether or not to use the parent-grouping feature to group results. 
     * @default false 
     */
    useGrouping?: boolean;

    /**
     * Decides which ordering algorithm to use. Allowed values: "Date", "Relevance", 
     * @default IOrder.Date
     */
    orderBy?: Order;
}

export default Query;