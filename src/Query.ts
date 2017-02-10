import { SearchType } from './SearchType';
import { OrderBy } from './OrderBy';
import { QuerySettings } from './QuerySettings';

/**
 * Defines the query parameters for the find() and categorize() calls.
 */
export class Query extends QuerySettings {

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
    constructor(queryText?: string | QuerySettings, searchType?: SearchType, filters?: string[], from?: Date, to?: Date, clientId?: string, pageSize?: number, page?: number, useGrouping?: boolean, orderBy?: OrderBy) {
        super();
        let o: QuerySettings = typeof queryText === "object" ? queryText : {} as QuerySettings;
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

    /**
     * Returns the specific rest-path segment for the find url.
     */
    public toFindUrlParam(): string {
        let params = this.commonUrlParams();

        // These params are additional for the find call
        if (this.pageSize) {
            params.push(`s=${encodeURIComponent(this.pageSize.toString())}`);
        }

        if (this.page) {
            params.push(`p=${encodeURIComponent(this.page.toString())}`);
        }

        if (this.useGrouping) {
            params.push(`g=${encodeURIComponent(this.useGrouping.toString())}`);
        }

        if (this.orderBy != null) {
            params.push(`o=${encodeURIComponent(OrderBy[this.orderBy])}`);
        }
        
        return this.joinUrlParams(params);
    }

    /**
     * Returns the specific rest-path segment for the categorize url.
     */
    public toCategorizeUrlParam(): string {
        // The categorize call takes only the common params from commonUrlParams()
        return this.joinUrlParams(this.commonUrlParams());
    }

    private commonUrlParams(): string[] {
        let params: string[] = [];

        if (this.queryText) {
            params.push(`q=${encodeURIComponent(this.queryText)}`);
        }

        if (this.searchType != null) {
            params.push(`t=${encodeURIComponent(SearchType[this.searchType])}`);
        }

        if (this.filters) {
            params.push(`f=${encodeURIComponent(this.filters.join(';'))}`);
        }

        if (this.from) {
            params.push(`df=${encodeURIComponent(this.from.toISOString())}`);
        }

        if (this.to) {
            params.push(`dt=${encodeURIComponent(this.to.toISOString())}`);
        }

        if (this.clientId) {
            params.push(`c=${encodeURIComponent(this.clientId)}`);
        }

        return params;
    }
    
    private joinUrlParams(params: string[]): string {
        return (params && params.length > 0) ? `?${params.join('&')}` : '';
    }
}
