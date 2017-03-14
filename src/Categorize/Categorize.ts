import { fetch } from 'domain-task';

import { DateSpecification } from '../Common/Query';
import { BaseCall } from '../Common/BaseCall';
import { OrderBy } from '../Common/OrderBy';
import { SearchType } from '../Common/SearchType';
import { Query } from '../Common/Query';
import { QueryConverter, QueryCategorizeConverterV2, QueryCategorizeConverterV3 } from '../QueryConverter';
import { Categories } from '../Data/Categories';
import { AuthToken } from '../Authentication/AuthToken';

import { CategorizeSettings } from './CategorizeSettings';
import { CategorizeTriggers } from './CategorizeTriggers';

export class Categorize extends BaseCall<Categories> {

    private queryConverter: QueryConverter;

    /**
     * Creates a Categorize instance that handles fetching categories dependent on settings and query. 
     * Supports registering a callback in order to receive categories when they have been received.
     * @param baseUrl - The base url that the categorize is to fetch categories from.
     * @param settings - The settings that define how the Categorize instance is to operate.
     * @param auth - An object that handles the authentication.
     */
    constructor(baseUrl: string, protected settings: CategorizeSettings = new CategorizeSettings(), auth?: AuthToken) {
        super(baseUrl, new CategorizeSettings(settings), auth);
        this.queryConverter = this.settings.version === 2 ? new QueryCategorizeConverterV2() : new QueryCategorizeConverterV3();
    }

    /**
     * Fetches the search-result categories from the server.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a Categories object.
     */
    public fetch(query: Query, suppressCallbacks: boolean = false): Promise<Categories> {

        let url = this.queryConverter.getUrl(this.baseUrl + this.settings.url, query);
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
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
        } else {
            return undefined;
        }
    }

    public clientIdChanged(oldValue: string, query: Query) { 
        if (this.settings.triggers.clientIdChanged) {
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
     
    public filtersChanged(oldValue: string[], query: Query) { 
        if (this.settings.cbSuccess && this.settings.triggers.filterChanged) {
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
