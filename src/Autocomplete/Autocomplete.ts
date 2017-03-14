import { fetch } from 'domain-task';

import { BaseCall } from '../Common/BaseCall';
import { Query } from '../Common/Query';

import { AuthToken } from '../Authentication/AuthToken';

import { AutocompleteSettings } from './';

/**
 * This class allows you to create a service that executes autocomplete lookupds for the IntelliSearch SearchService.
 * 
 * Note: Typically you will not instantiate this class. Instead you will use it indirectly via the SearchClient class.
 */
export class Autocomplete extends BaseCall<string[]> {
    
    // private INTELLIDEBUGQUERY: string = ":INTELLIDEBUGQUERY";

    // private INTELLIALL: string = ":INTELLIALL";

    // private INTELLI: string = ":INTELLI";

    // private allCategories: AllCategories;

    // private allFilters: string[];

    /**
     * Creates an Autocomplete instance that knows how to get query-suggestions.
     * @param baseUrl - The base url that the Autocomplete is to use for fetching suggestions.
     * @param settings - The settings for how the Autocomplete is to operate.
     * @param auth - The object that handles authentication.
     */
    constructor(baseUrl: string, protected settings: AutocompleteSettings = new AutocompleteSettings(), auth?: AuthToken/*, allCategories: AllCategories*/) {
        super(baseUrl, new AutocompleteSettings(settings), auth);

        // TODO: In the future when the query-field allows specifying filters we should fetch all-categories from the server in order to help suggest completions.
        // allCategories.fetch().then((categories) => { 
        //   // TODO: Convert the hierarchical categories into a flit list of filters
        //   this.allFilters = categories;
        // });
    }

    /**
     * When called it will execute a rest-call to the base-url and fetch sutocomplete suggestions based on the query passed.
     * Note that if a request callback has been setup then if it returns false the request is skipped.
     * @param query - Is used to find out which autocomplete suggestions and from what sources they should be retrieved. 
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a Promise that when resolved returns a string array of suggestions (or undefined if a callback stops the request).
     */
    public fetch(query: Query, suppressCallbacks: boolean = false): Promise<string[]> {

        let url = this.toUrl(query);
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
            return fetch(url, reqInit)
                .then((response: Response) => {
                    if (!response.ok) {
                        throw Error(`${response.status} ${response.statusText} for request url '${url}'`);
                    }
                    return response.json();
                })
                .then((suggestions: string[]) => {
                    this.cbSuccess(suppressCallbacks, suggestions, url, reqInit);
                    return suggestions;
                })
                .catch((error) => {
                    this.cbError(suppressCallbacks, error, url, reqInit);
                    return Promise.reject(error);
                });
        } else {
            return undefined;
        }
    }

    public maxSuggestionsChanged(oldValue: number, query: Query) {
        if (this.settings.cbSuccess && this.settings.triggers.maxSuggestionsChanged) {
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
    
    // TODO: In the future we may differ on what autocomplete suggestions to suggest depending on the searchtype. 
    //public searchTypeChanged(oldValue: SearchType, query: CategorizeQuery) { }

    /**
     * Returns the specific rest-path segment for the autocomplete url.
     */
    private toUrl(query: Query): string {
        let params: string[] = [];

        params.push(`l=1}`); // Forces this to always do server-side when called. The client will skip calling when not needed instead.
        params.push(`q=${encodeURIComponent(query.queryText)}`);
        params.push(`s=${encodeURIComponent(query.maxSuggestions.toString())}`);

        return `${this.baseUrl + this.settings.url}?${params.join('&')}`;
    }

    // private updateWordSuggestions(query: Query) {
    //     // Not implemented ywt.
    // }

    // private completeWord(query: Query): string[] {
    //     let words = query.queryText.split(" "); 
    //     let word = words.splice(-1)[0].toUpperCase(); // <words> should now contain all words except the word that is in <word>
    //     let wordSuggestions: string[] = [];

    //     if (this.settings.suggestQueryCommandWords) {
    //         if (word.startsWith(this.INTELLI)) {
    //             if (word !== this.INTELLIDEBUGQUERY) {
    //                 wordSuggestions.push(this.INTELLIDEBUGQUERY);
    //             }
    //             if (word !== this.INTELLIALL) {
    //                 wordSuggestions.push(this.INTELLIALL);
    //             }
    //         }
    //     }

    //     if (this.settings.suggestIndexFilters) {
    //         if (word.length > 2 && word.startsWith("#")) {
    //             // TODO: Iterate categories and return list of matching category-filters (minus anyone already set in the query.
    //         }
    //     }

    //     // Combine the suggested words with the leading words before returning word-suggestions (since we only support one type of lookup currently)
    //     return wordSuggestions.map((w) => words.concat(w).join(" "));
    // }
}
