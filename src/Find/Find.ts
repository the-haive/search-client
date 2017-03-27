import { fetch } from 'domain-task';

import { DateSpecification } from '../Common/Query';
import { BaseCall } from '../Common/BaseCall';
import { OrderBy } from '../Common/OrderBy';
import { SearchType } from '../Common/SearchType';
import { Filter } from '../Common/Filter';
import { Query } from '../Common/Query';
import { QueryConverter, QueryFindConverterV2, QueryFindConverterV3 } from '../QueryConverter';
import { Matches } from '../Data/Matches';
import { AuthToken } from '../Authentication/AuthToken';
import { Categorize } from '../Categorize/Categorize';

import { FindSettings } from './FindSettings';

/**
 * Wraps the find search-service rest-service. 
 * 
 * Normally used indirectly via the SearchClient.
 */
export class Find extends BaseCall<Matches> {

    private queryConverter: QueryConverter;

    /**
     * Creates a Find instance that handles fetching matches dependent on settings and query. 
     * @param baseUrl - The base url that the find call is to use.
     * @param settings - The settings that define how the Find instance is to operate.
     * @param auth - An auth-object that handles the authentication.
     */
    constructor(baseUrl: string, protected settings?: FindSettings, auth?: AuthToken) {
        super(baseUrl, new FindSettings(settings), auth);

        this.settings = new FindSettings(settings);

        this.queryConverter = this.settings.version === 2 ? new QueryFindConverterV2() : new QueryFindConverterV3();
    }

    /**
     * Fetches the search-result matches from the server. 
     * Note that if a request callback has been setup then if it returns false the request is skipped.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a Promise that when resolved returns a string array of suggestions (or undefined if a callback stops the request).
     */
    public fetch(query: Query = new Query(), suppressCallbacks: boolean = false): Promise<Matches> {
        
        let url = this.queryConverter.getUrl(this.baseUrl, this.settings.url, query);
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
        if (this.settings.cbSuccess && this.settings.triggers.clientIdChanged) {
            this.update(query);
        }
    }

    public dateFromChanged(oldValue: DateSpecification, query: Query) { 
        if (this.settings.cbSuccess && this.settings.triggers.dateFromChanged) {
            this.update(query);
        }
    }
     
    public dateToChanged(oldValue: DateSpecification, query: Query) { 
        if (this.settings.cbSuccess && this.settings.triggers.dateToChanged) {
            this.update(query);
        }
    }
     
    public filtersChanged(oldValue: Filter[], query: Query) { 
        if (this.settings.cbSuccess && this.settings.triggers.filterChanged) {
            this.update(query);
        }
    }

    public matchGroupingChanged(oldValue: boolean, query: Query) { 
        if (this.settings.cbSuccess && this.settings.triggers.matchGroupingChanged) {
            this.update(query);
        }
    }

    public matchOrderByChanged(oldValue: OrderBy, query: Query) { 
        if (this.settings.cbSuccess && this.settings.triggers.matchOrderByChanged) {
            this.update(query);
        }
    }
    
    public matchPageChanged(oldValue: number, query: Query) { 
        if (this.settings.cbSuccess && this.settings.triggers.matchPageChanged) {
            this.update(query);
        }
    }
    
    public matchPageSizeChanged(oldValue: number, query: Query) { 
        if (this.settings.cbSuccess && this.settings.triggers.matchPageSizeChanged) {
            this.update(query);
        }
    }
     
    public queryTextChanged(oldValue: string, query: Query) { 
        if (this.settings.cbSuccess && this.settings.triggers.queryChange) {
            if (query.queryText.length > this.settings.triggers.queryChangeMinLength) {
                if (this.settings.triggers.queryChangeInstantRegex && this.settings.triggers.queryChangeInstantRegex.test(query.queryText)) {
                    this.update(query);
                } else {
                    if (this.settings.triggers.queryChangeDelay > -1) {
                        // If a delay is already pending then clear it and restart the delay
                        clearTimeout(this.delay);
                        // Set up the delay
                        this.delay = setTimeout(() => {
                            this.update(query);
                        }, this.settings.triggers.queryChangeDelay);
                    }
                }
            }
        }
    }
     
    public searchTypeChanged(oldValue: SearchType, query: Query) { 
        if (this.settings.cbSuccess && this.settings.triggers.searchTypeChanged) {
            this.update(query);
        }
    }

}
