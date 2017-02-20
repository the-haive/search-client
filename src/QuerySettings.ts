import { SearchType } from './SearchType';
import { OrderBy } from './OrderBy';

export * from './SearchType';
export * from './OrderBy';

/**
 * These are all the settings that can affect the returned Matches for find() and Categories for categorize().
 */
export class QuerySettings {

    /**
     * The queryText to search for. Normally not set in settings, as they are normally set runtime from the queryfield.
     */
    public queryText: string;

    /**
     * The type of search to perform. Allowed values: "Keywords", "Relevance". 
     * @default SearchType.Keywords
     */
    public searchType: SearchType;

    /**
     * Use one of this query parameter to specify the filters to apply. Each filter should contain its group name 
     * followed by category names, representing complete hierarchy of the category. The names specified here is derived from category Name 
     * property and not its display name. When specifying multiple filters, separate them either by comma or semicolon. 
     * For example: &f=Authors|Sam;FileTypes|docx
     * Note the above names are case sensitive.
     * @default Empty (no filter set)
     */
    public filters: string[];

    /**
     * Used to specify the "from datetime" of a date-range filter. 
     * Expects an ISO 8601 datetime as a string. See https://en.wikipedia.org/wiki/ISO_8601 for details.
     * @default Empty (not set, in effect meaning that items will be returned no matter how **old** they are)
     */
    public from: Date;

    /**
     * Used to specify the "to datetime" of a date-range filter. 
     * Expects an ISO 8601 datetime as a string. See https://en.wikipedia.org/wiki/ISO_8601 for details.
     * @default Empty (not set, in effect meaning that items will be returned no matter how **new** they are)
     */
    public to: Date;

    /**
     * Any string that you want to identify the client with. Can be used in the catgegories configuration and in the relevance tuning.
     * @default Empty
     */
    public clientId: string;

    /**
     * The number of results per page to fetch. Expects a positive integer value. 
     * @default 10
     */
    public pageSize: number;

    /**
     * The actual page to fetch. The numbering is zero-based and expects a non-negative number. 
     * @default 0 (first page)
     */
    public page: number;

    /**
     * Decides whether or not to use the parent-grouping feature to group results. 
     * @default false 
     */
    public useGrouping: boolean;

    /**
     * Decides which ordering algorithm to use. Allowed values: "Date", "Relevance".
     * @default OrderBy.Date
     */
    public orderBy: OrderBy;
}
