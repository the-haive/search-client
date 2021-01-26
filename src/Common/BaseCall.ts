import fetch from "cross-fetch";

import { DateSpecification, IQuery, Query } from "./Query";
import { OrderBy } from "./OrderBy";
import { SearchType } from "./SearchType";
import { IBaseSettings } from "./BaseSettings";
import { AuthToken } from "../Authentication/AuthToken";

import { Filter } from "./Filter";
import { CategorizationType } from "./CategorizationType";
import { QueryChangeSpecifications } from "./QueryChangeSpecifications";

export type Fetch = (
    input?: Request | string,
    init?: RequestInit
) => Promise<Response>;

export interface IWarning {
    message: string;
    statusCode: number;
}

/**
 * A common service base-class for the descending Autocomplete, Categorize and Find classes.
 *
 * @param TDataType Defines the data-type that the descendant service-class needs to return on lookups.
 */
export abstract class BaseCall<TDataType> {
    protected fetchMethod: Fetch;

    protected settings?: IBaseSettings<TDataType>;

    protected auth?: AuthToken;

    protected deferUpdate: boolean;

    protected deferredQuery: IQuery | null;

    protected deferredUseMatchPage: boolean | null;

    protected delay: number;

    /**
     * The query used for the last fetch operation.
     * When the actual query is different from this then the UI should reflect that it is
     * not representative for the current query. It should then call a callback to notify
     * on this state.
     * The UI can then decide what to do with the no-longer representative results, for instance:
     *   - Remove the results)
     *   - "Disable" the results
     *   - "Ghost" the results (but allow operating on them)
     */
    protected fetchQuery: IQuery;

    /**
     * Indicates whether or not a running fetch is running
     */
    protected fetching: boolean;

    private abortController: AbortController;

    /**
     * Decides whether an update should be executed or not. Typically used to temporarily turn off update-execution.
     * When turned back on the second param can be used to indicate whether pending updates should be executed or not.
     * @param state Turns on or off deferring of updates.
     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring is turned off. The param is ignored for state=true.
     */
    public deferUpdates(state: boolean, skipPending: boolean = false) {
        this.deferUpdate = state;
        if (!state && this.deferredQuery) {
            const query = this.deferredQuery;
            const useMatchPage = this.deferredUseMatchPage;
            this.deferredQuery = null;
            this.deferredUseMatchPage = null;
            if (!skipPending && this.shouldUpdate()) {
                this.update(query, null, useMatchPage);
            }
        }
    }

    /**
     * Can be used to check the state of deferUpdates.
     */
    get deferUpdateState(): boolean {
        return this.deferUpdate;
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
            "Content-Type": "application/json"
        };

        if (
            includeAuthorizationHeader &&
            this.auth &&
            this.auth.authenticationToken
        ) {
            headers.Authorization = `Bearer ${this.auth.authenticationToken}`;
        }

        // If a fetch is already running, abort it - if not already aborted
        if (this.fetching && this.abortController && !this.abortController.signal.aborted) {
            this.abortController.abort();
        }
        // Setup new abort-controller (to reset the existing - in case it has been aborted)
        this.abortController = new AbortController();

        return {
            cache: "default",
            credentials: "include",
            headers,
            method: "GET",
            mode: "cors",
            signal: this.abortController.signal
        } as RequestInit;
    }

    /**
     * Call the service, but take into account deferredUpdates.
     *
     * @param query The query object to create the fetch for.
     * @param delay A delay for when to execute the update, in milliseconds. Defaults to undefined.
     * @param useQueryMatchPage If true then the query matchpage number will not be reset to 1. Otherwise it is by default always 1.
     */
    public update(
        query: IQuery,
        delay?: number,
        useQueryMatchPage?: boolean
    ): void {
        if (!useQueryMatchPage) {
            query.matchPage = 1;
        }
        if (this.deferUpdate) {
            // Save the query, so that when the deferUpdate is again false we can then execute it.
            this.deferredQuery = query;
            this.deferredUseMatchPage = useQueryMatchPage;
        } else {
            // In case this action is triggered when a delayed execution is already pending, clear that pending timeout.
            clearTimeout(this.delay);

            if (delay > 0) {
                // Set up the delay
                this.delay = setTimeout(() => {
                    let fetchPromise = this.fetch(query);
                    if (fetchPromise) {
                        fetchPromise.catch(error => Promise.resolve(null));
                    }
                }, delay) as any;
            } else {
                let fetchPromise = this.fetch(query);
                if (fetchPromise) {
                    fetchPromise.catch(error => Promise.resolve(null));
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
            this.outdatedWarning(fieldName, query);
        }
        return this.settings.cbSuccess && this.settings.enabled;
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
        this.settings = settings;
        this.auth = auth;
        this.fetchMethod = fetchMethod || fetch;
        this.abortController = null;
        this.fetching = false;
    }

    protected abstract fetch(
        query?: IQuery,
        suppressCallbacks?: boolean
    ): Promise<any>;

    protected cbRequest(
        suppressCallbacks: boolean,
        url: string,
        reqInit: RequestInit
    ): boolean {
        if (!this.settings) {
            throw new Error("Settings cannot be empty.");
        }
        if (this.settings.cbRequest && !suppressCallbacks) {
            return this.settings.cbRequest(url, reqInit) !== false;
        }
        // If no request-callback is set up we return true to allow the fetch to be executed
        return true;
    }

    protected cbError(
        suppressCallbacks: boolean,
        error: any,
        url: string,
        reqInit: RequestInit
    ): void {
        if (!this.settings) {
            throw new Error("Settings cannot be empty.");
        }
        if (this.settings.cbError && !suppressCallbacks) {
            this.settings.cbError(error);
        }
    }
    protected cbWarning(
        suppressCallbacks: boolean,
        warning: IWarning,
        url: string,
        reqInit: RequestInit
    ): void {
        if (!this.settings) {
            throw new Error("Settings cannot be empty.");
        }
        if (this.settings.cbWarning && !suppressCallbacks) {
            this.settings.cbWarning(warning);
        }
    }

    protected cbSuccess(
        suppressCallbacks: boolean,
        data: TDataType,
        url: string,
        reqInit: RequestInit
    ): void {
        if (!this.settings) {
            throw new Error("Settings cannot be empty.");
        }
        if (this.settings.cbSuccess && !suppressCallbacks) {
            this.settings.cbSuccess(data);
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
            let invalid = this.fetchQuery
                ? !(this.fetchQuery as Query).equals(query, this.settings.queryChangeSpecs)
                : false;

            this.settings.cbResultState(invalid, this.fetchQuery, query);
        }
    }
}
