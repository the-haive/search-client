import * as merge from 'deepmerge';
import { fetch } from 'domain-task';
import { baseUrl as rootUrl } from 'domain-task/fetch';
import { isWebUri } from 'valid-url';

import { Autocomplete } from './Autocomplete';
import { AutocompleteSettings } from './AutocompleteSettings';
import { Categories } from './Categories';
import { Matches } from './Matches';
import { Settings } from './Settings';
import { Query } from './Query';
import { QuerySettings } from './QuerySettings';

import { Triggers } from './Triggers';
import { CallbackHandlers } from './CallbackHandlers';

export * from './Autocomplete';
export * from './AutocompleteSettings';
export * from './Categories';
export * from './Category';
export * from './Group';
export * from './Matches';
export * from './MatchItem';
export * from './MetaList';
export * from './OrderBy';
export * from './Query';
export * from './QuerySettings';
export * from './SearchType';
export * from './Settings';
export * from './UrlSettings';

/**
 * The SearchClient class contains methods to handle the IntelliSearch Search Service REST functionality.
 * 
 * Use the constructor to create an instance where you pass initialization values. 
 * 
 * You can use the "low-level" autocomplete(), find(), categorize(), allCategories() and bestBets() calls 
 * where the results are returned via Promises for simplicity.
 * 
 * Coming:
 * Alternatively, you can also use the monitor() call and pass DOM elements for the query-field, optionally 
 * a search-button as well as Triggers and CallbackHandlers. When any of the triggers detect a need to rerun 
 * any of the aforementioned calls the results will be called into the registered callback-handlers. You can 
 * then focus on presenting data as they appear in your callback-handlers.
 */
export class SearchClient {
    /** The endpoint url for the autocomplete() call. */
    public autocompleteUrl: string;
    /** The endpoint url for the allCategories() call. */
    public allCategoriesUrl: string;
    /** The endpoint url for the bestBets() call. */
    public bestBetsUrl: string;
    /** The endpoint url for the categorize() call. */
    public categorizeUrl: string;
    /** The endpoint url for the find() call. */
    public findUrl: string;

    private settings: Settings;

    /** 
     * The SearchClient constructor allows you to create a 'search-client' instance that allows
     * execuing find(), categorize(), autocomplete(), bestBets() and allCategories() calls on the 
     * search engine that it connects to.
     * @param baseUrl - The baseUrl for the search-engine, typically 'http:<search-server.domain>/RestService/v3/'
     * @param settings - A settings object for more control of initialization values.
     */
    //constructor(settings: Settings){
    constructor(baseUrl: string, settings?: Settings) {
        // Strip off any slashes at the end of the baseUrl
        baseUrl = baseUrl.replace(/\/+$/, "");

        // Verify the authenticity
        if (!isWebUri(baseUrl)) {
            throw new Error('Error: No baseUrl is defined. Please supply a valid baseUrl in the format: http[s]://<domain.com>[:port][/path]');
        }

        // The domain-task fetch needs tis for non-browser environments.
        let match = baseUrl.split('/');
        rootUrl(`${match[0]}//${match[2]}/`);

        this.settings = new Settings(settings);

        this.allCategoriesUrl = baseUrl + (this.settings.url.allCategories || '/search/allcategories');
        this.autocompleteUrl = baseUrl + (this.settings.url.autocomplete || '/autocomplete');
        this.bestBetsUrl = baseUrl + (this.settings.url.bestBets || '/manage/bestbets');
        this.categorizeUrl = baseUrl + (this.settings.url.categorize || '/search/categorize');
        this.findUrl = baseUrl + (this.settings.url.find || '/search/find');
    }

    /**
     * Executes autocomplete() on the server and returns the results (string[]) as a promise.
     */
    public autocomplete(autocomplete?: AutocompleteSettings | string): Promise<string[]> {
        if (typeof autocomplete === "string") {
            autocomplete = new Autocomplete(autocomplete);
        }

        let mergedAutocomplete = new Autocomplete(merge(this.settings.autocomplete, autocomplete, true));

        let url = `${this.autocompleteUrl}${mergedAutocomplete.toUrlParam()}`;

        return fetch(this.requestObject(url))
            .then((response: Response) => {
                if (!response.ok) {
                    throw Error(`${response.status} ${response.statusText} for request url '${url}'`);
                }
                return response.json();
            })
            .then((suggestions: string[]) => {
                return suggestions;
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    /**
     * Executes a find() on the server and returns the results (Matches) as a promise.
     */
    public find(query?: QuerySettings | string): Promise<Matches> {
        if (typeof query === "string") {
            query = new Query(query);
        }

        let mergedQuery = new Query(merge(this.settings.query, query, true));

        // TODO: State the query, so that we can do actions, such as nextPage(), prevPage(), addFilter(), removeFilter(), setQuerytext(), setSearchType(), setOrderBy().

        let url = `${this.findUrl}${mergedQuery.toFindUrlParam()}`;

        return fetch(this.requestObject(url))
            .then((response: Response) => {
                if (!response.ok) {
                    throw Error(`${response.status} ${response.statusText} for request url '${url}'`);
                }
                return response.json();
            })
            .then((matches: Matches) => {
                return matches;
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    /**
     * Executes a categorize() on the server and returns the results (Categories) as a promise.
     */
    public categorize(query?: QuerySettings | string): Promise<Categories> {
        if (typeof query === "string") {
            query = new Query(query);
        }

        let mergedQuery = new Query(merge(this.settings.query, query, true));

        // TODO: State the query, so that we can do actions, such as nextPage(), prevPage(), addFilter(), removeFilter(), setQuerytext(), setSearchType(), setOrderBy().

        let url = `${this.categorizeUrl}${mergedQuery.toCategorizeUrlParam()}`;

        return fetch(this.requestObject(url))
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

    /**
     * Executes an allCategories() on the server and returns the results (Categories) as a promise.
     */
    public allCategories(): Promise<Categories> {
        return fetch(this.requestObject(this.allCategoriesUrl))
            .then((response: Response) => {
                if (!response.ok) {
                    throw Error(`${response.status} ${response.statusText} for request url '${this.allCategoriesUrl}'`);
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

    /**
     * Executes a bestBets() call on the server and returns the results (string[]) as a promise.
     */
    public bestBets(): Promise<string[]> {
        return fetch(this.requestObject(this.bestBetsUrl))
            .then((response: Response) => {
                if (!response.ok) {
                    throw Error(`${response.status} ${response.statusText} for request url '${this.bestBetsUrl}'`);
                }
                return response.json();
            })
            .then((bestBets: string[]) => {
                return bestBets;
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    /**
     * Monitors the given query input-element for changes and for clicks on the searchButton. 
     * According to the passed Rules, execute a find() and/or categorize(). 
     * When search-results are returned, deliver these to the passed FindHandler and/or CategorizeHandler.
     * 
     * @param {HTMLElement} queryField The html element to monitor for input
     * @param {HTMLElement} searchButton The html element that acts as a search-button
     * @param {Triggers} triggers A list of Trigger rules for each search-operation (autocomplete, find, categorize) 
     *   that define when each of them are to be executed in regards to what state the input query-field is in.
     * @param {Handlers} handlers A set of handlers for each search-operation (autocomplete, find, categorize), so 
     *   that the search-client knows which callback to use for returning results.
     */
    public monitor(queryField: HTMLElement, searchButton: HTMLElement, triggers: Triggers, callbackHandlers: CallbackHandlers) {
        console.error("SearchClient.monitor(): Not implemented yet");
    }

    private requestObject(url: string) {
        let headers = new Headers();
        headers.set("Content-Type", "application/json");

        if (this.settings.authenticationToken) {
            headers.set("Authorization", `Bearer ${this.settings.authenticationToken}`);
        }
        let request = new Request(url, { 
            cache: 'default',
            credentials: "include",
            headers,
            method: 'GET',
            mode: 'cors',
        });
        return request;
    }
}
