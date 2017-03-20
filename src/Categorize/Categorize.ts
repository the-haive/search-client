import { fetch } from 'domain-task';

import { DateSpecification } from '../Common/Query';
import { BaseCall } from '../Common/BaseCall';
import { OrderBy } from '../Common/OrderBy';
import { SearchType } from '../Common/SearchType';
import { Query } from '../Common/Query';
import { QueryConverter, QueryCategorizeConverterV2, QueryCategorizeConverterV3 } from '../QueryConverter';
import { Categories, Category, Group } from '../Data';
import { AuthToken } from '../Authentication/AuthToken';

import { CategorizeSettings } from './CategorizeSettings';
import { CategorizeTriggers } from './CategorizeTriggers';

/**
 * The Categorize service queries the search-engine for which categories that any 
 * search-matches for the same query will contain.
 * 
 * It is normally used indirectly via the SearchClient class.
 */
export class Categorize extends BaseCall<Categories> {

    private categories: Categories;

    private clientCategoryFilter: { [ key: string ]: string | RegExp } = { };

    private queryConverter: QueryConverter;

    /**
     * Creates a Categorize instance that handles fetching categories dependent on settings and query. 
     * Supports registering a callback in order to receive categories when they have been received.
     * @param baseUrl - The base url that the categorize is to fetch categories from.
     * @param settings - The settings that define how the Categorize instance is to operate.
     * @param auth - An object that handles the authentication.
     */
    constructor(baseUrl: string, protected settings?: CategorizeSettings, auth?: AuthToken) {
        super(baseUrl, new CategorizeSettings(settings), auth);

        this.settings = new CategorizeSettings(settings);
        
        this.queryConverter = this.settings.version === 2 ? new QueryCategorizeConverterV2() : new QueryCategorizeConverterV3();
    }

    /**
     * Fetches the search-result categories from the server.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a Categories object.
     */
    public fetch(query?: Query, suppressCallbacks: boolean = false): Promise<Categories> {

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
                .then((categories: Categories) => {
                    this.categories = categories;
                    this.filterCategories(categories);
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

    public clientCategoryFiltersChanged(oldValue: { [ key: string ]: string | RegExp }, value: { [ key: string ]: string | RegExp }): void {
        this.clientCategoryFilter = value;
        if (this.settings.cbSuccess && this.settings.triggers.clientCategoryFilterChanged) {
            this.cbSuccess(false, this.filterCategories(this.categories), null, null);
        }
     };

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

    private filterCategories(categories: Categories): Categories {
        let cats = {...categories};
        let groups = cats.groups.map((inGroup: Group) => {
            let group = {...inGroup};
            if (group.categories && group.categories.length > 0) {
                group.categories = this.mapCategories(group.categories);
            }
            group.expanded = group.expanded || group.categories.some((c) => c.expanded === true);
            return group;
        });
        cats.groups = groups.filter((g) => { return g !== undefined; });
        return cats;
    }

    private mapCategories(categories: Category[]): Category[] {
        let cats = [...categories];
        cats = cats.map((inCategory: Category) => {
            let category = {...inCategory};
            let result = this.inClientCategoryFilters({...category});
            if (result !== false) {
                if (result) {
                    if (category.children && category.children.length > 0) {
                        category.children = this.mapCategories(category.children);
                    }
                    category.expanded = true;
                }
                category.expanded = category.expanded || category.children.some((c) => c.expanded === true);
                return category;
            }
        });

        cats = cats.filter((c) => { return c !== undefined; });
        return cats;
    }

    private inClientCategoryFilters(category: Category): boolean {
        if (!this.clientCategoryFilter) {
            return null;
        }
        for (let prop in this.clientCategoryFilter) {
            if (this.clientCategoryFilter.hasOwnProperty(prop)) {
                let filterKey = prop.toLowerCase();
                let cat = category.categoryName.slice(0, -1);
                let categoryKey = cat.join(this.settings.clientCategoryFiltersSepChar).toLowerCase();
                if (filterKey === categoryKey) {
                    let displayExpression = this.clientCategoryFilter[prop];
                    if (!displayExpression) {
                        continue;
                    }
                    let regex = new RegExp(displayExpression as string, "i");
                    let result = regex.test(category.displayName);
                    return result;
                } else {
                    continue;
                }
            }
        }
        return null;
    }
}
