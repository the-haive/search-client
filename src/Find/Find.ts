import { fetch } from 'domain-task';

import { DateSpecification } from '../Common/Query';
import { BaseCall } from '../Common/BaseCall';
import { OrderBy } from '../Common/OrderBy';
import { SearchType } from '../Common/SearchType';
import { Query } from '../Common/Query';
import { Matches } from '../Data/Matches';
import { AuthToken } from '../Authentication/AuthToken';
import { Categorize } from '../Categorize/Categorize';

import { FindSettings } from './FindSettings';

export class Find extends BaseCall<Matches> {

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
     * @param baseUrl - The base url that the find call is to use.
     * @param settings - The settings that define how the Find instance is to operate.
     * @param auth - An auth-object that handles the authentication.
     */
    constructor(baseUrl: string, protected settings: FindSettings = new FindSettings(), auth?: AuthToken) {
        super(baseUrl, settings, auth);
    }

    /**
     * Fetches the search-result matches from the server. 
     * Note that if a request callback has been setup then if it returns false the request is skipped.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a Promise that when resolved returns a string array of suggestions (or undefined if a callback stops the request).
     */
    public fetch(query: Query, suppressCallbacks: boolean = false): Promise<Matches> {

        let params = Find.getUrlParams(query);
        let url = `${this.baseUrl + this.settings.url}?${params.join('&')}`;
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
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
        } else {
            return undefined;
        }
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

}
