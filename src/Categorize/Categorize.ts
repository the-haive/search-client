//import { DateRange } from '../Common/DateRange';
import { fetch } from 'domain-task';
import moment from 'moment/moment';

import { DateSpecification } from '../Common/Query';
import { BaseCall } from '../Common/BaseCall';
import { OrderBy } from '../Common/OrderBy';
import { SearchType } from '../Common/SearchType';
import { Query } from '../Common/Query';
import { DeferUpdates } from '../Common/DeferUpdates';
import { Categories } from '../Data/Categories';
import { AuthToken } from '../Authentication/AuthToken';

import { CategorizeSettings } from './CategorizeSettings';
import { CategorizeTrigger } from './CategorizeTrigger';

export class Categorize extends BaseCall {

    /**
     * Returns the specific rest-path segment for the Categorize url.
     */
    public static getUrlParams(query: Query, params: string[] = []): string[] {

        if (query.queryText) {
            params.push(`q=${encodeURIComponent(query.queryText)}`);
        }

        if (query.searchType != null) {
            params.push(`t=${encodeURIComponent(SearchType[query.searchType])}`);
        }

        if (query.filters) {
            params.push(`f=${encodeURIComponent(query.filters.join(';'))}`);
        }

        if (query.dateFrom && query.dateTo) {
            params.push(`df=${encodeURIComponent(Categorize.createDate(query.dateFrom))}`);
            params.push(`dt=${encodeURIComponent(Categorize.createDate(query.dateFrom))}`);
        }

        if (query.clientId) {
            params.push(`c=${encodeURIComponent(query.clientId)}`);
        }

        return params;
    }

    private static createDate(date: Date | string | number | moment.DurationInputObject): string {
        let dateString: string;
        if (typeof date === "object" && !(date instanceof String) && !(date instanceof Date)) {
            dateString = moment().add(date).toISOString();
        } else {
            dateString = moment(date).toISOString();
        }
        return dateString;
    }

    /**
     * Creates a Categorize instance that handles fetching categories dependent on settings and query. 
     * Supports registering a callback in order to receive categories when they have been received.
     * @param baseUrl - The base url that the categorize is to fetch categories from.
     * @param settings - The settings that define how the Categorize instance is to operate.
     * @param auth - An object that handles the authentication.
     */
    constructor(baseUrl: string, private settings?: CategorizeSettings, auth?: AuthToken) {
        super(baseUrl, auth);
        this.settings = new CategorizeSettings(settings);
    }

    /**
     * Fetches the search-result categories from the server.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a Categories object.
     */
    public fetch(query: Query, suppressCallbacks: boolean = false): Promise<Categories> {

        let params = Categorize.getUrlParams(query);
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
            .then((categories: Categories) => {
                this.cbSuccess(suppressCallbacks, categories, url, reqInit);
                return categories;
            })
            .catch((error) => {
                this.cbError(suppressCallbacks, error, url, reqInit);
                return Promise.reject(error);
            });
    }

    public clientIdChanged(oldValue: string, query: Query) { 
        if (this.settings.trigger.clientIdChanged) {
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

    private cbSuccess(suppressCallbacks: boolean, categories: Categories, url: string, reqInit: RequestInit): void {
        this.cbBusy(suppressCallbacks, false, url, reqInit);
        if (this.settings.cbSuccess && !suppressCallbacks) {
            this.settings.cbSuccess(categories);
        }
    }
    
}
