import { fetch } from 'domain-task';

import { DateSpecification } from '../Common/Query';
import { BaseCall } from '../Common/BaseCall';
import { OrderBy } from '../Common/OrderBy';
import { SearchType } from '../Common/SearchType';
import { Query } from '../Common/Query';
import { DeferUpdates } from '../Common/DeferUpdates';
import { Matches } from '../Data/Matches';
import { AuthToken } from '../Authentication/AuthToken';
import { Categorize } from '../Categorize/Categorize';

import { FindSettings } from './FindSettings';

export class Find extends BaseCall {

    /**
     * Returns the specific rest-path segment for the Find url.
     */
    private static getUrlParams(query: Query, params: string[] = []): string[] {
        params = Categorize.getUrlParams(query, params);

        if (query.matchPageSize) {
            params.push(`s=${encodeURIComponent(query.matchPageSize.toString())}`);
        }

        if (query.matchPage) {
            params.push(`p=${encodeURIComponent(query.matchPage.toString())}`);
        }

        if (query.matchGrouping) {
            params.push(`g=${encodeURIComponent(query.matchGrouping.toString())}`);
        }

        if (query.matchOrderBy != null) {
            params.push(`o=${encodeURIComponent(OrderBy[query.matchOrderBy])}`);
        }

        return params;
    }

    /**
     * Creates a Find instance that handles fetching matches dependent on settings and query. 
     * Supports registering a callback in order to receive matches when they have been received.
     * @param baseUrl - The base url that the find call is to use.
     * @param settings - The settings that define how the Find instance is to operate.
     * @param auth - An auth-object that handles the authentication.
     */
    constructor(baseUrl: string, private settings?: FindSettings, auth?: AuthToken) {
        super(baseUrl, auth);
        this.settings = new FindSettings(settings);
    }

    /**
     * Fetches the search-result matches from the server.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a Matches object.
     */
    public fetch(query: Query, suppressCallbacks: boolean = false): Promise<Matches> {

        let params = Find.getUrlParams(query);
        let url = `${this.baseUrl + this.settings.url}?${params.join('&')}`;
        let reqInit = this.requestObject();

        this.cbBusy(suppressCallbacks, true, url, reqInit);

        return fetch(url, reqInit)
            .then((response: Response) => {
                if (!response.ok) {
                    throw Error(`${response.status} ${response.statusText} for request url '${url}'`);
                }
                return response.json();
            })
            .then((matches: Matches) => {
                this.cbSuccess(suppressCallbacks, matches, url, reqInit);
                return matches;
            })
            .catch((error) => {
                this.cbError(suppressCallbacks, error, url, reqInit);
                return Promise.reject(error);
            });
    }

    public clientIdChanged(oldValue: string, query: Query) { 
        if (this.settings.cbSuccess && this.settings.trigger.clientIdChanged) {
            this.update(query);
        }
    }

    public dateFromChanged(oldValue: DateSpecification, query: Query) { 
        if (this.settings.cbSuccess && this.settings.trigger.dateFromChanged) {
            this.update(query);
        }
    }
     
    public dateToChanged(oldValue: DateSpecification, query: Query) { 
        if (this.settings.cbSuccess && this.settings.trigger.dateToChanged) {
            this.update(query);
        }
    }
     
    public filtersChanged(oldValue: string[], query: Query) { 
        if (this.settings.cbSuccess && this.settings.trigger.filterChanged) {
            this.update(query);
        }
    }

    public matchGroupingChanged(oldValue: boolean, query: Query) { 
        if (this.settings.cbSuccess && this.settings.trigger.matchGroupingChanged) {
            this.update(query);
        }
    }

    public matchOrderByChanged(oldValue: OrderBy, query: Query) { 
        if (this.settings.cbSuccess && this.settings.trigger.matchOrderByChanged) {
            this.update(query);
        }
    }
    
    public matchPageChanged(oldValue: number, query: Query) { 
        if (this.settings.cbSuccess && this.settings.trigger.matchPageChanged) {
            this.update(query);
        }
    }
    
    public matchPageSizeChanged(oldValue: number, query: Query) { 
        if (this.settings.cbSuccess && this.settings.trigger.matchPageSizeChanged) {
            this.update(query);
        }
    }
     
    public queryTextChanged(oldValue: string, query: Query) { 
        if (this.settings.cbSuccess && this.settings.trigger.queryChange) {
            if (query.queryText.length > this.settings.trigger.queryChangeMinLength) {
                if (this.settings.trigger.queryChangeInstantRegex && this.settings.trigger.queryChangeInstantRegex.test(query.queryText)) {
                    this.update(query);
                } else {
                    if (this.settings.trigger.queryChangeDelay > -1) {
                        // If a delay is already pending then clear it and restart the delay
                        clearTimeout(this.delay);
                        // Set up the delay
                        this.delay = setTimeout(() => {
                            this.update(query);
                        }, this.settings.trigger.queryChangeDelay);
                    }
                }
            }
        }
    }
     
    public searchTypeChanged(oldValue: SearchType, query: Query) { 
        if (this.settings.cbSuccess && this.settings.trigger.searchTypeChanged) {
            this.update(query);
        }
    }

    private cbBusy(suppressCallbacks: boolean, loading: boolean, url: string, reqInit: RequestInit): void {
        if (this.settings.cbBusy && !suppressCallbacks) {
            this.settings.cbBusy(true, url, reqInit);
        }
    }

    private cbError(suppressCallbacks: boolean, error: any, url: string, reqInit: RequestInit): void {
        this.cbBusy(suppressCallbacks, false, url, reqInit);
        if (this.settings.cbSuccess && !suppressCallbacks) {
            this.settings.cbError(error);
        }
    }

    private cbSuccess(suppressCallbacks: boolean, matches: Matches, url: string, reqInit: RequestInit): void {
        this.cbBusy(suppressCallbacks, false, url, reqInit);
        if (this.settings.cbSuccess && !suppressCallbacks) {
            this.settings.cbSuccess(matches);
        }
    }
    
}
