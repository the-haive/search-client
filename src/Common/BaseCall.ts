import fetch from 'cross-fetch'
import { AuthToken } from '../Authentication/AuthToken'
import { IBaseSettings } from './BaseSettings'
import { OrderBy } from './OrderBy'
import { DateSpecification, IQuery, Query } from './Query'
import { SearchType } from './SearchType'

import { CategorizationType } from './CategorizationType'
import { Filter } from './Filter'
import { QueryChangeSpecifications } from './QueryChangeSpecifications'

export type Fetch = typeof fetch

export interface IWarning {
    message: string
    statusCode?: number
}

/**
 * A common service base-class for the descending Autocomplete, Categorize and Find classes.
 *
 * @param TDataType Defines the data-type that the descendant service-class needs to return on lookups.
 */
export abstract class BaseCall<TDataType> {
    protected fetchMethod: Fetch

    protected settings?: IBaseSettings<TDataType>

    protected auth?: AuthToken

    protected deferUpdate: boolean

    protected deferredQuery: IQuery | null

    protected deferredUseMatchPage: boolean | null

    protected delay: number

    /**
     * The query used for the last fetch operation.
     * When the actual query is different from this then the UI should reflect that it is
     * not representative for the current query. It should then call a callback to notify
     * on this state.
     * The UI can then decide what to do with the no-longer representative results, for instance:
     *   - Remove the results
     *   - "Disable" the results
     *   - "Ghost" the results (but allow operating on them)
     */
    protected fetchQuery: IQuery

    protected requested: number = 0

    protected aborted: number = 0

    protected cancelled: number = 0

    protected failed: number = 0

    protected completed: number = 0

    private abortController: AbortController

    /**
     * The number of times this service-instance has started a request.
     */
    get numRequested(): number {
        return this.requested
    }

    /**
     * The number of times this service-instance has aborted a request (typically as a result to starting a new request while the previous is still running and needs to be aborted).
     */
    get numAborted(): number {
        return this.aborted
    }

    /**
     * The number of times this service-instance has cancelled a request (as directed from a user cbRequest rejection).
     */
    get numCancelled(): number {
        return this.cancelled
    }

    /**
     * The number of times this service-instance has failed during a request (not counting aborted or cancelled requests).
     */
    get numFailed(): number {
        return this.failed
    }

    /**
     * The number of times this service-instance has completed a request (not counting aborted or cancelled requests).
     */
    get numCompleted(): number {
        return this.completed
    }

    /**
     * Decides whether an update should be executed or not. Typically used to temporarily turn off update-execution.
     * When turned back on the second param can be used to indicate whether pending updates should be executed or not.
     * @param state Turns on or off deferring of updates.
     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring is turned off. The param is ignored for state=true.
     */
    public deferUpdates(state: boolean, skipPending: boolean = false) {
        this.deferUpdate = state
        if (!state && this.deferredQuery) {
            const query = this.deferredQuery
            const useMatchPage = this.deferredUseMatchPage
            this.deferredQuery = null
            this.deferredUseMatchPage = null
            if (!skipPending && this.shouldUpdate()) {
                this.update(query, null, useMatchPage)
            }
        }
    }

    /**
     * Can be used to check the state of deferUpdates.
     */
    get deferUpdateState(): boolean {
        return this.deferUpdate
    }

    /**
     * Fetches the results from the server.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns the data.
     */
    public async fetch(
        query?: IQuery,
        suppressCallbacks?: boolean
    ): Promise<TDataType> {
        try {
            const data = await this.fetchInternal(query, suppressCallbacks)
            this.completed++
            return data
        } catch (err) {
            if (err?.name === 'AbortError') {
                this.aborted++
            } else if (err?.name === 'cbRequestCancelled') {
                this.cancelled++
            } else {
                this.failed++
                console.error(err)
            }
            return null
        } finally {
            this.abortController = null
        }
    }

    /**
     * Sets up the Request that is to be executed, with headers and auth as needed.
     *
     * @param includeAuthorizationHeader Set to false to not include the auth jwt token in the request headers. Default=true
     */
    public requestObject(
        includeAuthorizationHeader: boolean = true
    ): RequestInit {
        const headers: any = {
            'Content-Type': 'application/json',
        }

        if (
            includeAuthorizationHeader &&
            this.auth &&
            this.auth.authenticationToken
        ) {
            headers.Authorization = `Bearer ${this.auth.authenticationToken}`
        }

        if (this.abortController && !this.abortController.signal.aborted) {
            // If the abortController exists, then the previous call is not completed yet. So, we should abort the current process
            this.abortController.abort()
        }

        // Setup new abort-controller (to reset for each request)
        this.abortController = new AbortController()

        this.requested++

        return {
            cache: 'default',
            credentials: 'include',
            headers,
            method: 'GET',
            mode: 'cors',
            signal: this.abortController.signal,
        } as RequestInit
    }

    /**
     * Call the service, but take into account deferredUpdates.
     *
     * @param query The query object to create the fetch for.
     * @param delay A delay for when to execute the update, in milliseconds. Defaults to undefined.
     * @param useQueryMatchPage If true then the query match-page number will not be reset to 1. Otherwise it is by default always 1.
     */
    public update(
        query: IQuery,
        delay?: number,
        useQueryMatchPage?: boolean
    ): void {
        if (!useQueryMatchPage) {
            query.matchPage = 1
        }
        if (this.deferUpdate) {
            // Save the query, so that when the deferUpdate is again false we can then execute it.
            this.deferredQuery = query
            this.deferredUseMatchPage = useQueryMatchPage
        } else {
            // In case this action is triggered when a delayed execution is already pending, clear that pending timeout.
            clearTimeout(this.delay)

            if (delay > 0) {
                // Set up the delay
                this.delay = setTimeout(() => {
                    const fetchPromise = this.fetch(query)
                    if (fetchPromise) {
                        fetchPromise.catch(error => Promise.resolve(null))
                    }
                }, delay) as any
            } else {
                const fetchPromise = this.fetch(query)
                if (fetchPromise) {
                    fetchPromise.catch(error => Promise.resolve(null))
                }
            }
        }
    }

    public shouldUpdate(fieldName?: string, query?: IQuery): boolean {
        if (
            this.settings.cbSuccess &&
            this.settings.enabled &&
            fieldName &&
            query
        ) {
            this.outdatedWarning(fieldName, query)
        }
        return this.settings.cbSuccess && this.settings.enabled
    }

    public clientIdChanged(oldValue: string, query: IQuery): void {
        /* Default no implementation*/
    }
    public categorizationTypeChanged(
        oldValue: CategorizationType,
        query: IQuery
    ): void {
        /* Default no implementation*/
    }
    public dateFromChanged(oldValue: DateSpecification, query: IQuery): void {
        /* Default no implementation*/
    }
    public dateToChanged(oldValue: DateSpecification, query: IQuery): void {
        /* Default no implementation*/
    }
    public filtersChanged(oldValue: Filter[], query: IQuery): void {
        /* Default no implementation*/
    }
    public matchGenerateContentChanged(oldValue: boolean, query: IQuery): void {
        /* Default no implementation*/
    }
    public matchGenerateContentHighlightsChanged(
        oldValue: boolean,
        query: IQuery
    ): void {
        /* Default no implementation*/
    }
    public matchGroupingChanged(oldValue: boolean, query: IQuery): void {
        /* Default no implementation*/
    }
    public matchOrderByChanged(oldValue: OrderBy, query: IQuery): void {
        /* Default no implementation*/
    }
    public matchPageChanged(oldValue: number, query: IQuery): void {
        /* Default no implementation*/
    }
    public matchPageSizeChanged(oldValue: number, query: IQuery): void {
        /* Default no implementation*/
    }
    public maxSuggestionsChanged(oldValue: number, query: IQuery): void {
        /* Default no implementation*/
    }
    public queryTextChanged(oldValue: string, query: IQuery): void {
        /* Default no implementation*/
    }
    public searchTypeChanged(oldValue: SearchType, query: IQuery): void {
        /* Default no implementation*/
    }
    public uiLanguageCodeChanged(oldValue: string, query: IQuery): void {
        /* Default no implementation*/
    }

    /**
     * Sets up a the common base handling for services, such as checking that the url is valid and handling the authentication.
     *
     * @param settings - The base url for the service to be setup.
     * @param auth - The auth-object that controls authentication for the service.
     */
    protected init(
        settings: IBaseSettings<TDataType>,
        auth?: AuthToken,
        fetchMethod?: Fetch
    ) {
        this.settings = settings
        this.auth = auth
        this.fetchMethod = fetchMethod || fetch
        this.abortController = null
    }

    protected abstract fetchInternal(
        query?: IQuery,
        suppressCallbacks?: boolean
    ): Promise<TDataType>

    protected cbRequest(
        suppressCallbacks: boolean,
        url: string,
        reqInit: RequestInit
    ): boolean {
        if (!this.settings) {
            throw new Error('Settings cannot be empty.')
        }

        const shouldFetch =
            this.settings.cbRequest && !suppressCallbacks
                ? this.settings.cbRequest(url, reqInit) !== false
                : true

        if (!shouldFetch) {
            this.abortController = null
        }
        return shouldFetch
    }

    protected cbError(
        suppressCallbacks: boolean,
        error: any,
        url: string,
        reqInit: RequestInit
    ): void {
        if (!this.settings) {
            throw new Error('Settings cannot be empty.')
        }
        if (this.settings.cbError && !suppressCallbacks) {
            this.settings.cbError(error)
        }
    }
    protected cbWarning(
        suppressCallbacks: boolean,
        warning: IWarning,
        url: string,
        reqInit: RequestInit
    ): void {
        if (!this.settings) {
            throw new Error('Settings cannot be empty.')
        }
        if (this.settings.cbWarning && !suppressCallbacks) {
            this.settings.cbWarning(warning)
        }
    }

    protected cbSuccess(
        suppressCallbacks: boolean,
        data: TDataType,
        url: string,
        reqInit: RequestInit
    ): void {
        if (!this.settings) {
            throw new Error('Settings cannot be empty.')
        }
        if (this.settings.cbSuccess && !suppressCallbacks) {
            this.settings.cbSuccess(data)
        }
    }

    /**
     * Checks whether or not to notify that the results are invalidated (no longer representative for the query).
     */
    private outdatedWarning(fieldName: string, query: IQuery) {
        if (
            this.settings.cbResultState &&
            this.settings.queryChangeSpecs &
                QueryChangeSpecifications[fieldName]
        ) {
            const invalid = this.fetchQuery
                ? !(this.fetchQuery as Query).equals(
                      query,
                      this.settings.queryChangeSpecs
                  )
                : false

            this.settings.cbResultState(invalid, this.fetchQuery, query)
        }
    }
}
