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

    private delay: NodeJS.Timer;

    /**
     * Creates a Find instance that handles fetching matches dependent on settings and query. 
     * Supports registering a callback in order to receive matches when they have been received.
     * @param baseUrl - The base url that the find call is to use.
     * @param settings - The settings that define how the Find instance is to operate.
     * @param auth - An auth-object that handles the authentication.
     */
    constructor(baseUrl: string, private settings?: FindSettings, auth?: AuthToken) {
        super(baseUrl, auth);
        this.settings = FindSettings.new(settings);
    }

    /**
     * Fetches the search-result matches from the server.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallback - Set to true if you have defined a callback, but somehow don't want it to be called.
     * @returns a promise that when resolved returns a Matches object.
     */
    public fetch(query: Query, supressCallback: boolean = false): Promise<Matches> {

        let params = Find.getUrlParams(query);
        let url = `${this.baseUrl + this.settings.url}?${params.join('&')}`;

        return fetch(url, this.requestObject())
            .then((response: Response) => {
                if (!response.ok) {
                    throw Error(`${response.status} ${response.statusText} for request url '${url}'`);
                }
                return response.json();
            })
            .then((matches: Matches) => {
                if (this.settings.callback && !supressCallback) {
                    this.settings.callback(matches);
                }
                return matches;
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    public clientIdChanged(oldValue: string, query: Query) { 
        if (this.settings.callback && this.settings.trigger.clientIdChanged) {
            this.updateMatches(query);
        }
    }

    public dateFromChanged(oldValue: DateSpecification, query: Query) { 
        if (this.settings.callback && this.settings.trigger.dateFromChanged) {
            this.updateMatches(query);
        }
    }
     
    public dateToChanged(oldValue: DateSpecification, query: Query) { 
        if (this.settings.callback && this.settings.trigger.dateToChanged) {
            this.updateMatches(query);
        }
    }
     
    public filtersChanged(oldValue: string[], query: Query) { 
        if (this.settings.callback && this.settings.trigger.filterChanged) {
            this.updateMatches(query);
        }
    }

    public matchGroupingChanged(oldValue: boolean, query: Query) { 
        if (this.settings.callback && this.settings.trigger.matchGroupingChanged) {
            this.updateMatches(query);
        }
    }

    public matchOrderByChanged(oldValue: OrderBy, query: Query) { 
        if (this.settings.callback && this.settings.trigger.matchOrderByChanged) {
            this.updateMatches(query);
        }
    }
    
    public matchPageChanged(oldValue: number, query: Query) { 
        if (this.settings.callback && this.settings.trigger.matchPageChanged) {
            this.updateMatches(query);
        }
    }
    
    public matchPageSizeChanged(oldValue: number, query: Query) { 
        if (this.settings.callback && this.settings.trigger.matchPageSizeChanged) {
            this.updateMatches(query);
        }
    }
     
    public queryTextChanged(oldValue: string, query: Query) { 
        if (this.settings.callback && this.settings.trigger.queryChanged) {
            if (query.queryText.length > this.settings.trigger.queryMinLength) {
                if (this.settings.trigger.queryChangeUndelayedRegex && this.settings.trigger.queryChangeUndelayedRegex.test(query.queryText)) {
                    this.updateMatches(query);
                } else {
                    if (this.settings.trigger.queryChangeTriggerDelay > 0) {
                        // If a delay is already pending then clear it and restart the delay
                        clearTimeout(this.delay);
                        // Set up the delay
                        this.delay = setTimeout(() => {
                            this.updateMatches(query);
                        }, this.settings.trigger.queryChangeTriggerDelay);
                    } else {
                        this.updateMatches(query);
                    }
                }
            }
        }
    }
     
    public searchTypeChanged(oldValue: SearchType, query: Query) { 
        if (this.settings.callback && this.settings.trigger.searchTypeChanged) {
            this.updateMatches(query);
        }
    }

    private updateMatches(query: Query) {
        // In case this action is triggered when a delayed execution is already pending, clear that pending timeout.
        clearTimeout(this.delay);

        this.fetch(query);
    }
}
