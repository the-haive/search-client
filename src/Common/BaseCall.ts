import { isWebUri } from 'valid-url';

import { DateSpecification } from '../Common/Query';
import { OrderBy } from '../Common/OrderBy';
import { SearchType } from '../Common/SearchType';
import { BaseSettings } from '../Common/BaseSettings';
import { AuthToken } from '../Authentication/AuthToken';

import { Filter } from './Filter';
import { Query } from './Query';

/**
 * A common service base-class for the descending Autocomplete, Categorize and Find classes.
 * 
 * @param TDataType Defines the data-type that the descendant service-class needs to return on lookups.
 */
export abstract class BaseCall<TDataType> {

    protected deferUpdate: boolean = false;

    protected deferredQuery: Query = undefined;

    protected delay: NodeJS.Timer;

    /**
     * Sets up a the common base handling for services, such as checking that the url is valid and handling the authentication.
     * 
     * @param baseUrl - The base url for the service to be setup.
     * @param auth - The auth-object that controls authentication for the service.
     */
    constructor(public baseUrl: string, protected settings?: BaseSettings<TDataType>, protected auth: AuthToken = new AuthToken()) {
        // Strip off any slashes at the end of the baseUrl
        baseUrl = `${baseUrl.replace(/\/+$/, "")}/${settings.path}`;

        // Verify the authenticity
        if (!isWebUri(baseUrl)) {
            throw new Error('Error: No baseUrl is defined. Please supply a valid baseUrl in the format: http[s]://<domain.com>[:port][/path]');
        }

        this.baseUrl = baseUrl;
        this.settings = settings;
        this.auth = auth;
    }

    /**
     * Decides whether an update should be executed or not. Typically used to temporarily turn off update-execution. 
     * When turned back on the second param can be used to indicate whether pending updates should be executed or not.
     * @param state Turns on or off deferring of updates.
     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring is turned off. The param is ignored for state=true.
     */
    public deferUpdates(state: boolean, skipPending: boolean = false) {
        this.deferUpdate = state;
        if (!state && this.deferredQuery) {
            let query = this.deferredQuery;
            this.deferredQuery = undefined;
            if (!skipPending) {
                this.update(query);
            }
        }
    }

    /**
     * Sets up the Request that is to be executed, with headers and auth as needed.
     */
    public requestObject(): RequestInit {
        let headers = new Headers();
        headers.set("Content-Type", "application/json");

        if (this.auth && this.auth.authenticationToken) {
            headers.set("Authorization", `Bearer ${this.auth.authenticationToken}`);
        }

        return { 
            cache: 'default',
            credentials: "include",
            headers,
            method: 'GET',
            mode: 'cors',
        } as RequestInit;
    }

    public update(query: Query): void {
        if (this.deferUpdate) {
            // Save the query, so that when the deferUpdate is again false we can then execute it.
            this.deferredQuery = query;
        } else {
            // In case this action is triggered when a delayed execution is already pending, clear that pending timeout.
            clearTimeout(this.delay);
            this.fetch(query);
        }
    }

    public clientCategoryFiltersChanged(oldValue: { [ key: string ]: string | RegExp }, value: { [ key: string ]: string | RegExp }): void { /* Default no implementation*/ };
    public clientIdChanged(oldValue: string, query: Query): void { /* Default no implementation*/ };
    public dateFromChanged(oldValue: DateSpecification, query: Query): void { /* Default no implementation*/ }
    public dateToChanged(oldValue: DateSpecification, query: Query): void { /* Default no implementation*/ }
    public filtersChanged(oldValue: Filter[], query: Query): void { /* Default no implementation*/ }
    public matchGroupingChanged(oldValue: boolean, query: Query): void { /* Default no implementation*/ }
    public matchOrderByChanged(oldValue: OrderBy, query: Query): void { /* Default no implementation*/ }
    public matchPageChanged(oldValue: number, query: Query): void { /* Default no implementation*/ }
    public matchPageSizeChanged(oldValue: number, query: Query): void { /* Default no implementation*/ }
    public maxSuggestionsChanged(oldValue: number, query: Query): void { /* Default no implementation*/ }
    public queryTextChanged(oldValue: string, query: Query): void { /* Default no implementation*/ }
    public searchTypeChanged(oldValue: SearchType, query: Query): void { /* Default no implementation*/ }

    protected abstract fetch(query?: Query, suppressCallbacks?: boolean): Promise<any> 

    protected cbRequest(suppressCallbacks: boolean, url: string, reqInit: RequestInit): boolean {
        if (this.settings.cbRequest && !suppressCallbacks) {
            return this.settings.cbRequest(url, reqInit);
        }
        // If no request-callback is set up we return true to allow the fetch to be executed
        return true;
    }

    protected cbError(suppressCallbacks: boolean, error: any, url: string, reqInit: RequestInit): void {
        if (this.settings.cbSuccess && !suppressCallbacks) {
            this.settings.cbError(error);
        }
    }

    protected cbSuccess(suppressCallbacks: boolean, data: TDataType, url: string, reqInit: RequestInit): void {
        if (this.settings.cbSuccess && !suppressCallbacks) {
            this.settings.cbSuccess(data);
        }
    }

}
