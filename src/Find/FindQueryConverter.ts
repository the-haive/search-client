import { BaseQueryConverter, OrderBy, SearchType, Query } from '../Common';

/**
 * Class to handle creating categorize lookups for restservice version 3.
 */
export class FindQueryConverter extends BaseQueryConverter {
    /**
     * Converts the query params to an array of key=value segments.
     */
    protected getUrlParams(query: Query): string[] {
        let params: string[] = [];

        this.addParamIfSet(params, 'c', query.clientId);
        this.addParamIfSet(params, 'df', this.createDate(query.dateFrom));
        this.addParamIfSet(params, 'dt', this.createDate(query.dateTo));
        let filters: string[] = query.filters.map((f) => f.category.categoryName.join('|'));
        this.addParamIfSet(params, 'f', filters.join(';'));
        this.addParamIfSet(params, 'q', query.queryText);
        this.addParamIfSet(params, 't', SearchType[query.searchType]);
        this.addParamIfSet(params, 'l', query.uiLanguageCode);
        this.addParamIfSet(params, 'g', query.matchGrouping);
        this.addParamIfSet(params, 'o', OrderBy[query.matchOrderBy]);
        this.addParamIfSet(params, 'p', query.matchPage);
        this.addParamIfSet(params, 's', query.matchPageSize);
        this.addParamIfSet(params, 'gc', query.matchGenerateContent);
        this.addParamIfSet(params, 'gch', query.matchGenerateContentHighlights);

        return params;
    }
}
