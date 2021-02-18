import { BaseQueryConverter, Query } from '../Common'

/**
 * Class to handle creating find lookups.
 */
export class FindQueryConverter extends BaseQueryConverter {
    /**
     * Converts the query params to an array of key=value segments.
     */
    protected getUrlParams(query: Query): string[] {
        const params: string[] = []

        this.addParamIfSet(params, 'c', query.clientId)
        this.addParamIfSet(params, 'df', this.createDate(query.dateFrom))
        this.addParamIfSet(params, 'dt', this.createDate(query.dateTo))
        const filters: string[] = query.filters.map(f =>
            f.category.categoryName.join('|').replace(';','/;')
        )
        this.addParamIfSet(params, 'f', filters.join(';'))
        this.addParamIfSet(params, 'q', query.queryText)
        this.addParamIfSet(params, 't', query.searchType)
        this.addParamIfSet(params, 'l', query.uiLanguageCode)
        this.addParamIfSet(params, 'g', query.matchGrouping)
        this.addParamIfSet(params, 'o', query.matchOrderBy)
        this.addParamIfSet(params, 'p', query.matchPage)
        this.addParamIfSet(params, 's', query.matchPageSize)
        this.addParamIfSet(params, 'gc', query.matchGenerateContent)
        this.addParamIfSet(params, 'gch', query.matchGenerateContentHighlights)

        return params
    }
}
