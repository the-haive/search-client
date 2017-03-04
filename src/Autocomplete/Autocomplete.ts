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

    private settings: AutocompleteSettings;

    private delay: NodeJS.Timer;

    // private allCategories: AllCategories;

    // private allFilters: string[];

    constructor(baseUrl: string, settings?: AutocompleteSettings, auth?: AuthToken/*, allCategories: AllCategories*/) {
        super(baseUrl, auth);
        this.settings = settings;

        // TODO: In the future when the query-field allows specifying filters we should fetch all-categories from the server in order to help suggest completions.
        // allCategories.fetch().then((categories) => { 
        //   // TODO: Convert the hierarchical categories into a flit list of filters
        //   this.allFilters = categories;
        // });
    }

    public fetch(query: Query): Promise<string[]> {

        let url = this.toUrl(query);

        return fetch(url, this.requestObject())
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
        this.updateWordSuggestions(query);
        this.updatePhraseSuggestions(query);
    }

    private updateWordSuggestions(query: Query) {
        // Not implemented ywt.
    }

    private updatePhraseSuggestions(query: Query) {
        this.fetch(query)
        .then((suggestions) => {
            let words = this.completeWord(query);
            // TODO We return the special suggestions as the first suggestions, in addition to the results returned from the index. 
            // We may in the future make these returns into different suggestions. So that the :intelli* suggestions are fast, while the index takes longer. 
            // We can then update the suggestions when needed. We also need to think more about which types of suggestions we deliver (phrase, word, command, filters etc.)
            this.settings.callback(words.concat(suggestions));
        });
    }

    private completeWord(query: Query): string[] {
        let words = query.queryText.split(" "); 
        let word = words.splice(-1)[0].toUpperCase(); // <words> should now contain all words except the word that is in <word>
        let wordSuggestions: string[] = [];

        if (this.settings.suggestQueryCommandWords) {
            if (word.startsWith(this.INTELLI)) {
                if (word !== this.INTELLIDEBUGQUERY) {
                    wordSuggestions.push(this.INTELLIDEBUGQUERY);
                }
                if (word !== this.INTELLIALL) {
                    wordSuggestions.push(this.INTELLIALL);
                }
            }
        }

        if (this.settings.suggestIndexFilters) {
            if (word.length > 2 && word.startsWith("#")) {
                // TODO: Iterate categories and return list of matching category-filters (minus anyone already set in the query.
            }
        }

        // Combine the suggested words with the leading words before returning word-suggestions (since we only support one type of lookup currently)
        return wordSuggestions.map((w) => words.concat(w).join(" "));
    }
}
