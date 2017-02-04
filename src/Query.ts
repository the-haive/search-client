import { SearchType } from './SearchType';
//import Filters from './Filters';
import { OrderBy } from './OrderBy';

export class QueryProps {
    public queryText?: string;

    /**
     * The type of search to perform. Allowed values: "Keywords", "Relevance". 
     * @default SearchType.Keywords
     */
    public searchType?: SearchType;

    /**
     * Use one of this query parameter to specify the filters to apply. Each filter should contain its group name 
     * followed by category names, representing complete hierarchy of the category. The names specified here is derived from category Name 
     * property and not its display name. When specifying multiple filters, separate them either by comma or semicolon. 
     * For example: &f=Authors|Sam;FileTypes|docx
     * Note the above names are case sensitive.
     * @default Empty (no filter set)
     */
    public filters?: string[];

    /**
     * Used to specify the "from datetime" of a date-range filter. 
     * Expects an ISO 8601 datetime as a string. See https://en.wikipedia.org/wiki/ISO_8601 for details.
     * @default Empty (not set, in effect meaning that items will be returned no matter how **old** they are)
     */
    public from?: Date;

    /**
     * Used to specify the "to datetime" of a date-range filter. 
     * Expects an ISO 8601 datetime as a string. See https://en.wikipedia.org/wiki/ISO_8601 for details.
     * @default Empty (not set, in effect meaning that items will be returned no matter how **new** they are)
     */
    public to?: Date;

    /**
     * Any string that you want to identify the client with. Can be used in the catgegories configuration and in the relevance tuning.
     * @default Empty
     */
    public clientId?: string;

    /**
     * The number of results per page to fetch. Expects a positive integer value. 
     * @default 10
     */
    public pageSize?: number;

    /**
     * The actual page to fetch. The numbering is zero-based and expects a non-negative number. 
     * @default 0 (first page)
     */
    public page?: number;

    /**
     * Decides whether or not to use the parent-grouping feature to group results. 
     * @default false 
     */
    public useGrouping?: boolean;

    /**
     * Decides which ordering algorithm to use. Allowed values: "Date", "Relevance", 
     * @default OrderBy.Date
     */
    public orderBy?: OrderBy;
}

/**
 * Defines the query parameters for the various API calls (find, categorize, bestBets, autocomplete, ...)
 */
export class Query extends QueryProps {

    /**
     * The constructor can either take the listed params as function arguments, or you can send in a object with each of the listed params as keys (JSON notation).
     * 
     * @param queryText - The text to search for.
     * @param searchType - The type of search to perform. @see SearchType.
     * @param filters - Specifies which filters to apply. Each filter should contain it's group name followed by category names, representing the complete hierarchy of the category, all separated by pipe-characters. The names specified here is derived from category Name property (not its display name).
     * @param from - Used to specify the "from datetime" of a date-range filter. Expects an ISO 8601 datetime as a string. See https://en.wikipedia.org/wiki/ISO_8601 for details. The default is empty (not set), in effect meaning that items will be returned no matter how old they are.
     * @param to - Used to specify the "to datetime" of a date-range filter. Expects an ISO 8601 datetime as a string. See https://en.wikipedia.org/wiki/ISO_8601 for details. The default is empty (not set), in effect meaning that items will be returned no matter how new they are. 
     * @param clientId - Any string that you want to identify the client (you) with. It can be used in the categories configuration and in the relevance tuning. If none of those features are in use, or if the clientId passed desn match, or if it is not supplied then it will be ignored.
     * @param pageSize - The number of results per page to fetch. If you want your users to browse (page) results then you should keep this the same for every request.
     * @param page - The actual page to fetch. The numbering is zero-based, meaning that the first page is page 0. Use this to allow browsing (paging) the results.
     * @param useGrouping - Set to true to use the parent-grouping feature that groups the results by their parents.
     * @param orderBy - Used to change the ordering of the results. @see OrderBy.
     */
    constructor(queryText?: string | QueryProps, searchType?: SearchType, filters?: string[], from?: Date, to?: Date, clientId?: string, pageSize?: number, page?: number, useGrouping?: boolean, orderBy?: OrderBy) {
        super();
        let o: QueryProps = typeof queryText === "object" ? queryText : {} as QueryProps;
        this.queryText = o.queryText || queryText as string || '';
        this.searchType = o.searchType || searchType || SearchType.Keywords;
        this.filters = o.filters || filters || [];
        this.from = o.from || from;
        this.to = o.to || to;
        this.clientId = o.clientId || clientId;
        this.pageSize = o.pageSize || pageSize || 10;
        this.page = o.page || page || 0;
        this.useGrouping = o.useGrouping || useGrouping || false;
        this.orderBy = o.orderBy || orderBy || OrderBy.Date;
    }

    public toFindUrlParam() {
        let params = this.commonUrlParams();

        // These params are additional for the find call
        if (this.pageSize) {
            params.push(`s=${this.pageSize.toString()}`);
        }

        if (this.page) {
            params.push(`p=${this.page.toString()}`);
        }

        if (this.useGrouping) {
            params.push(`g=${this.useGrouping.toString()}`);
        }

        if (this.orderBy != null) {
            params.push(`o=${OrderBy[this.orderBy]}`);
        }
        
        return this.renderUrlParams(params);
    }

    public toCategorizeUrlParam() {
        // The categorize call takes only the common params from commonUrlParams()
        return this.renderUrlParams(this.commonUrlParams());
    }
    
    private commonUrlParams(): string[] {
        let params: string[] = [];

        if (this.queryText) {
            params.push(`q=${this.queryText}`);
        }

        if (this.searchType != null) {
            params.push(`t=${SearchType[this.searchType]}`);
        }

        if (this.filters) {
            params.push(`f=${this.filters.join(';')}`);
        }

        if (this.from) {
            params.push(`df=${this.from.toISOString()}`);
        }

        if (this.to) {
            params.push(`dt=${this.to.toISOString()}`);
        }

        if (this.clientId) {
            params.push(`c=${this.clientId}`);
        }

        return params;
    }

    private renderUrlParams(params: string[]): string {
        return (params && params.length > 0) ? `?${params.join('&')}` : '';
    }
}
