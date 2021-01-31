import { AuthToken } from '../Authentication'
import {
    BaseCall,
    DateSpecification,
    Fetch,
    Filter,
    IQuery,
    OrderBy,
    Query,
    SearchType,
} from '../Common'
import { IMatches } from '../Data'
import { FindQueryConverter } from './FindQueryConverter'
import { FindSettings, IFindSettings } from './FindSettings'

/**
 * The Find service queries the search-engine for search-matches for the given query.
 *
 * It is normally used indirectly via the SearchClient class.
 */
export class Find extends BaseCall<IMatches> {
    public settings: IFindSettings

    private queryConverter: FindQueryConverter

    /**
     * Creates a Find instance that handles fetching matches dependent on settings and query.
     * @param settings - The settings that define how the Find instance is to operate.
     * @param auth - An auth-object that handles the authentication.
     */
    constructor(
        settings: IFindSettings | string,
        auth?: AuthToken,
        fetchMethod?: Fetch
    ) {
        super() // dummy
        // prepare for super.init
        settings = new FindSettings(settings)
        auth = auth || new AuthToken()
        super.init(settings, auth, fetchMethod)
        // Set own this props
        this.queryConverter = new FindQueryConverter()
        // console.log(`search-client/Find.ctor: Created new Find instance`);
    }

    public clientIdChanged(oldValue: string, query: IQuery) {
        if (!this.shouldUpdate('clientId', query)) {
            return
        }
        if (this.settings.triggers.clientIdChanged) {
            this.update(query)
        }
    }

    public dateFromChanged(oldValue: DateSpecification, query: IQuery) {
        if (!this.shouldUpdate('dateFrom', query)) {
            return
        }
        if (this.settings.triggers.dateFromChanged) {
            this.update(query)
        }
    }

    public dateToChanged(oldValue: DateSpecification, query: IQuery) {
        if (!this.shouldUpdate('dateTo', query)) {
            return
        }
        if (this.settings.triggers.dateToChanged) {
            this.update(query)
        }
    }

    public filtersChanged(oldValue: Filter[], query: IQuery) {
        if (!this.shouldUpdate('filters', query)) {
            return
        }
        if (this.settings.triggers.filtersChanged) {
            this.update(query)
        }
    }

    public matchGenerateContentChanged(oldValue: boolean, query: IQuery) {
        if (!this.shouldUpdate('matchGenerateContent', query)) {
            return
        }
        if (this.settings.triggers.matchGenerateContentChanged) {
            this.update(query)
        }
    }

    public matchGenerateContentHighlightsChanged(
        oldValue: boolean,
        query: IQuery
    ) {
        if (!this.shouldUpdate('matchGenerateContentHighlights', query)) {
            return
        }
        if (
            this.settings.triggers.matchGenerateContentChanged &&
            this.settings.triggers.matchGenerateContentHighlightsChanged
        ) {
            this.update(query)
        }
    }

    public matchGroupingChanged(oldValue: boolean, query: IQuery) {
        if (!this.shouldUpdate('matchGrouping', query)) {
            return
        }
        if (this.settings.triggers.matchGroupingChanged) {
            this.update(query)
        }
    }

    public matchOrderByChanged(oldValue: OrderBy, query: IQuery) {
        if (!this.shouldUpdate('matchOrderBy', query)) {
            return
        }
        if (this.settings.triggers.matchOrderByChanged) {
            this.update(query)
        }
    }

    public matchPageChanged(oldValue: number, query: IQuery) {
        if (!this.shouldUpdate('matchPage', query)) {
            return
        }
        if (this.settings.triggers.matchPageChanged) {
            this.update(query, null, true)
        }
    }

    public matchPageSizeChanged(oldValue: number, query: IQuery) {
        if (!this.shouldUpdate('matchPageSize', query)) {
            return
        }
        if (this.settings.triggers.matchPageSizeChanged) {
            this.update(query)
        }
    }

    public queryTextChanged(oldValue: string, query: IQuery) {
        if (!this.shouldUpdate('queryText', query)) {
            return
        }
        if (this.settings.triggers.queryChange) {
            if (
                query.queryText.trim().length >
                this.settings.triggers.queryChangeMinLength
            ) {
                if (
                    this.settings.triggers.queryChangeInstantRegex &&
                    this.settings.triggers.queryChangeInstantRegex.test(
                        query.queryText
                    )
                ) {
                    this.update(query)
                    return
                } else {
                    if (this.settings.triggers.queryChangeDelay > -1) {
                        this.update(
                            query,
                            this.settings.triggers.queryChangeDelay
                        )
                        return
                    }
                }
            }
        }
        clearTimeout(this.delay)
    }

    public searchTypeChanged(oldValue: SearchType, query: IQuery) {
        if (!this.shouldUpdate('searchType', query)) {
            return
        }
        if (this.settings.triggers.searchTypeChanged) {
            this.update(query)
        }
    }

    public uiLanguageCodeChanged(oldValue: string, query: IQuery) {
        if (!this.shouldUpdate('uiLanguageCode', query)) {
            return
        }
        if (this.settings.triggers.uiLanguageCodeChanged) {
            this.update(query)
        }
    }

    /**
     * Fetches the search-result matches from the server.
     * Note that if a request callback has been setup then if it returns false the request is skipped.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a Promise that when resolved returns a string array of suggestions (or undefined if a callback stops the request).
     */
    protected async fetchInternal(
        query: IQuery = new Query(),
        suppressCallbacks: boolean = false
    ): Promise<IMatches> {
        const reqInit = this.requestObject()
        this.fetchQuery = new Query(query)
        const url = this.queryConverter.getUrl(
            this.settings.url,
            this.fetchQuery
        )

        try {
            if (!this.cbRequest(suppressCallbacks, url, reqInit)) {
                const err = new Error()
                err.name = 'cbRequestCancelled'
                throw err
            }

            const response = await this.fetchMethod(url, reqInit)
            if (!response.ok) {
                throw Error(
                    `${response.status} ${response.statusText} for request url '${url}'`
                )
            }

            const matches: IMatches = await response.json()

            // Handle situations where parsing was ok, but we have an error in the returned message from the server
            if (!matches || matches.errorMessage || matches.statusCode !== 0) {
                const warning = {
                    message: matches?.errorMessage || 'Unspecified issue',
                    statusCode: matches?.statusCode,
                }
                console.warn('search-client/Find.fetchInternal()> ', warning)
                this.cbWarning(suppressCallbacks, warning, url, reqInit)
            }

            this.cbSuccess(suppressCallbacks, matches, url, reqInit)
            return matches
        } catch (error) {
            if (error.name !== 'AbortError') {
                this.cbError(suppressCallbacks, error, url, reqInit)
            }
            throw error
        }
    }
}
