import { BaseQueryConverter, CategorizationType, Query } from '../Common'

/**
 * Class to handle creating categorize lookups.
 */
export class CategorizeQueryConverter extends BaseQueryConverter {
    /**
     * Converts the query params to an array of key=value segments.
     */
    protected getUrlParams(query: Query): string[] {
        const params: string[] = []

        this.addParamIfSet(params, 'c', query.clientId)
        this.addParamIfSet(params, 'df', this.createDate(query.dateFrom))
        this.addParamIfSet(params, 'dt', this.createDate(query.dateTo))
        const filters: string[] = query.filters
            .filter(f => !f.hidden)
            .map(f => f.category.categoryName.join('|'))
        this.addParamIfSet(params, 'f', filters.join(';'))
        const hiddenFilters: string[] = query.filters
            .filter(f => f.hidden === true)
            .map(f => f.category.categoryName.join('|'))
        this.addParamIfSet(params, 'hf', hiddenFilters.join(';'))
        this.addParamIfSet(params, 'q', query.queryText)
        this.addParamIfSet(params, 't', query.searchType)
        this.addParamIfSet(params, 'l', query.uiLanguageCode)
        this.addParamIfSet(
            params,
            'ct',
            CategorizationType[query.categorizationType]
        )

        return params
    }
}
