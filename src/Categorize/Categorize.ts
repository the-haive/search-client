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

    private settings: CategorizeSettings;

    private delay: NodeJS.Timer;

    constructor(baseUrl: string, settings?: CategorizeSettings, auth?: AuthToken) {
        super(baseUrl, auth);
        this.settings = settings || new CategorizeSettings();
    }

    public fetch(query: Query): Promise<Categories> {

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

        this.fetch(query).then((categories) => {
            this.settings.callback(categories);
        });
    }
}
