//import { DateRange } from '../Common/DateRange';
import { fetch } from 'domain-task';
import moment from 'moment/moment';

import { DateSpecification } from '../Common/Query';
import { BaseCall } from '../Common/BaseCall';
import { OrderBy } from '../Common/OrderBy';
import { SearchType } from '../Common/SearchType';
import { Query } from '../Common/Query';
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

    private delay: NodeJS.Timer;

    /**
     * Creates a Categorize instance that handles fetching categories dependent on settings and query. 
     * Supports registering a callback in order to receive categories when they have been received.
     * @param baseUrl - The base url that the categorize is to fetch categories from.
     * @param settings - The settings that define how the Categorize instance is to operate.
     * @param auth - An object that handles the authentication.
     */
    constructor(baseUrl: string, private settings?: CategorizeSettings, auth?: AuthToken) {
        super(baseUrl, auth);
        this.settings = CategorizeSettings.new(settings);
    }

    /**
     * Fetches the search-result categories from the server.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallback - Set to true if you have defined a callback, but somehow don't want it to be called.
     * @returns a promise that when resolved returns a Categories object.
     */
    public fetch(query: Query, supressCallback: boolean = false): Promise<Categories> {

        let params = Categorize.getUrlParams(query);
        let url = `${this.baseUrl + this.settings.url}?${params.join('&')}`;

        return fetch(url, this.requestObject())
            .then((response: Response) => {
                if (!response.ok) {
                    throw Error(`${response.status} ${response.statusText} for request url '${url}'`);
                }
                return response.json();
            })
            .then((categories: Categories) => {
                if (this.settings.callback && !supressCallback) {
                    this.settings.callback(categories);
                }
                return categories;
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    public clientIdChanged(oldValue: string, query: Query) { 
        if (this.settings.trigger.clientIdChanged) {
            this.updateCategories(query);
        }
    }

    public dateFromChanged(oldValue: DateSpecification, query: Query) { 
        if (this.settings.callback && this.settings.trigger.dateFromChanged) {
            this.updateCategories(query);
        }
    }
     
    public dateToChanged(oldValue: DateSpecification, query: Query) { 
        if (this.settings.callback && this.settings.trigger.dateToChanged) {
            this.updateCategories(query);
        }
    }
     
    public filtersChanged(oldValue: string[], query: Query) { 
        if (this.settings.callback && this.settings.trigger.filterChanged) {
            this.updateCategories(query);
        }
    }
     
    public queryTextChanged(oldValue: string, query: Query) { 
        if (this.settings.callback && this.settings.trigger.queryChanged) {
            if (query.queryText.length > this.settings.trigger.queryMinLength) {
                if (this.settings.trigger.queryChangeUndelayedRegex && this.settings.trigger.queryChangeUndelayedRegex.test(query.queryText)) {
                    this.updateCategories(query);
                } else {
                    if (this.settings.trigger.queryChangeTriggerDelay > 0) {
                        // If a delay is already pending then clear it and restart the delay
                        clearTimeout(this.delay);
                        // Set up the delay
                        this.delay = setTimeout(() => {
                            this.updateCategories(query);
                        }, this.settings.trigger.queryChangeTriggerDelay);
                    } else {
                        this.updateCategories(query);
                    }
                }
            }
        }
    }
     
    public searchTypeChanged(oldValue: SearchType, query: Query) { 
        if (this.settings.callback && this.settings.trigger.searchTypeChanged) {
            this.updateCategories(query);
        }
    }

    private updateCategories(query: Query) {
        // In case this action is triggered when a delayed execution is already pending, clear that pending timeout.
        clearTimeout(this.delay);

        this.fetch(query);
    }
}
