import { fetch } from 'domain-task';

//import { AllCategories } from '../AllCategories';
import { BaseCall } from '../Common/BaseCall';
import { Query } from '../Common/Query';
import { AuthToken } from '../Authentication/AuthToken';

import { AutocompleteSettings } from './';

export class Autocomplete extends BaseCall {
    private INTELLIDEBUGQUERY: string = ":INTELLIDEBUGQUERY";

    private INTELLIALL: string = ":INTELLIALL";

    private INTELLI: string = ":INTELLI";

    private delay: NodeJS.Timer;

    // private allCategories: AllCategories;

    // private allFilters: string[];

    /**
     * Creates an Autocomplete instance that knows how to get query-suggestions.
     * @param baseUrl - The base url that the Autocomplete is to use for fetching suggestions.
     * @param settings - The settings for how the Autocomplete is to operate.
     * @param auth - The object that handles authentication.
     */
    constructor(baseUrl: string, private settings?: AutocompleteSettings, auth?: AuthToken/*, allCategories: AllCategories*/) {
        super(baseUrl, auth);
        this.settings = AutocompleteSettings.new(settings);

        // TODO: In the future when the query-field allows specifying filters we should fetch all-categories from the server in order to help suggest completions.
        // allCategories.fetch().then((categories) => { 
        //   // TODO: Convert the hierarchical categories into a flit list of filters
        //   this.allFilters = categories;
        // });
    }

    /**
     * When called it will execute a rest-call to the base-url and fetch sutocomplete suggestions based on the query passed.
     * Note: If a callback has been registered in the initial constructor then it is expected to NOT call that callback when 
     * the fetch call is completed. The callback is intended for the "automatic mode", where it is i.e. controlled by the SearchClient interface.
     * TODO: Add a parameter to control whether or not to call the callback when the call returns.
     * @param query - Is used to find out which autocomplete suggestions and from what sources they should be retrieved. 
     * @param suppressCallback - Set to true if you have defined a callback, but somehow don't want it to be called.
     * @returns a Promise that when resolved returns a string array of suggestions.
     */
    public fetch(query: Query, supressCallback: boolean = false): Promise<string[]> {

        let url = this.toUrl(query);

        return fetch(url, this.requestObject())
            .then((response: Response) => {
                if (!response.ok) {
                    throw Error(`${response.status} ${response.statusText} for request url '${url}'`);
                }
                return response.json();
            })
            .then((suggestions: string[]) => {
                if (this.settings.callback && !supressCallback) {
                    this.settings.callback(suggestions);
                }
                return suggestions;
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    public maxSuggestionsChanged(oldValue: number, query: Query) {
        if (this.settings.callback && this.settings.trigger.maxSuggestionsChanged) {
            this.updateSuggestions(query);
        }
    }

    public queryTextChanged(oldValue: string, query: Query) { 
        if (this.settings.callback && this.settings.trigger.queryChanged) {
            if (query.queryText.length > this.settings.trigger.queryMinLength) {
                if (this.settings.trigger.queryChangeUndelayedRegex && this.settings.trigger.queryChangeUndelayedRegex.test(query.queryText)) {
                    this.updateSuggestions(query);
                } else {
                    if (this.settings.trigger.queryChangeTriggerDelay > 0) {
                        // If a delay is already pending then clear it and restart the delay
                        clearTimeout(this.delay);
                        // Set up the delay
                        this.delay = setTimeout(() => {
                            this.updateSuggestions(query);
                        }, this.settings.trigger.queryChangeTriggerDelay);
                    } else {
                        this.updateSuggestions(query);
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

        params.push(`q=${encodeURIComponent(query.queryText)}`);
        params.push(`s=${encodeURIComponent(query.maxSuggestions.toString())}`);
        params.push(`l=1}`); // Forces this to always do server-side when called. The client will skip calling when not needed instead.

        return `${this.baseUrl + this.settings.url}?${params.join('&')}`;
    }

    private updateSuggestions(query: Query): void {
        //this.updateWordSuggestions(query);
        this.updatePhraseSuggestions(query);
    }

    // private updateWordSuggestions(query: Query) {
    //     // Not implemented ywt.
    // }

    private updatePhraseSuggestions(query: Query) {
        this.fetch(query);
    }

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
