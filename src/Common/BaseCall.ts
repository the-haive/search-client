import { isWebUri } from 'valid-url';

import { DateSpecification } from '../Common/Query';
import { OrderBy } from '../Common/OrderBy';
import { SearchType } from '../Common/SearchType';
import { AuthToken } from '../Authentication/AuthToken';
import { SearchClient } from '../SearchClient';

import { Query } from './Query';

export abstract class BaseCall {

    protected deferUpdate: boolean = false;

    protected deferredQuery: Query = undefined;

    protected delay: NodeJS.Timer;
    
    /**
     * Sets up a the common base handling for services, such as checking that the url is valid and handling the authentication.
     * 
     * @param baseUrl - The base url for the service to be setup.
     * @param auth - The auth-object that controls authentication for the service.
     */
    constructor(public baseUrl: string, protected auth: AuthToken) {
        // Strip off any slashes at the end of the baseUrl
        baseUrl = baseUrl.replace(/\/+$/, "");

        // Verify the authenticity
        if (!isWebUri(baseUrl)) {
            throw new Error('Error: No baseUrl is defined. Please supply a valid baseUrl in the format: http[s]://<domain.com>[:port][/path]');
        }

        this.baseUrl = baseUrl;
        this.auth = auth;
    }

    /**
     * Decides whether an update should be executed or not. Typically used to temporarily turn off update-execution. 
     * When turned back on the second param can be used to indicate whether pending updates should be executed or not.
     * @param state Turns on or off deferring of updates.
     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring is turned off. The param is ignored for state=true.
     */
    public deferUpdates(state: boolean, skipPending: boolean = false) {
        console.log(state, skipPending);
        this.deferUpdate = state;
        if (!state && this.deferredQuery) {
            let query = this.deferredQuery;
            this.deferredQuery = undefined;
            if (!skipPending) {
                console.log(skipPending);
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

    public clientIdChanged(oldValue: string, query: Query) { /* Default no implementation*/ };
    public dateFromChanged(oldValue: DateSpecification, query: Query) { /* Default no implementation*/ }
    public dateToChanged(oldValue: DateSpecification, query: Query) { /* Default no implementation*/ }
    public filtersChanged(oldValue: string[], query: Query) { /* Default no implementation*/ }
    public matchGroupingChanged(oldValue: boolean, query: Query) { /* Default no implementation*/ }
    public matchOrderByChanged(oldValue: OrderBy, query: Query) { /* Default no implementation*/ }
    public matchPageChanged(oldValue: number, query: Query) { /* Default no implementation*/ }
    public matchPageSizeChanged(oldValue: number, query: Query) { /* Default no implementation*/ }
    public maxSuggestionsChanged(oldValue: number, query: Query) { /* Default no implementation*/ }
    public queryTextChanged(oldValue: string, query: Query) { /* Default no implementation*/ }
    public searchTypeChanged(oldValue: SearchType, query: Query) { /* Default no implementation*/ }

    protected abstract fetch(query: Query, suppressCallbacks?: boolean): Promise<any> 

}
