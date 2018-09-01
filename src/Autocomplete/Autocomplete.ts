import { AuthToken } from "../Authentication";
import { BaseCall, Fetch, Query } from "../Common";
import { AutocompleteQueryConverter } from "./AutocompleteQueryConverter";
import { AutocompleteSettings } from "./AutocompleteSettings";

/**
 * This class allows you to create a service that executes autocomplete lookupds for the IntelliSearch SearchService.
 *
 * Note: Typically you will not instantiate this class. Instead you will use it indirectly via the SearchClient class.
 */
export class Autocomplete extends BaseCall<string[]> {
    private queryConverter: AutocompleteQueryConverter;

    /**
     * Creates an Autocomplete instance that knows how to get query-suggestions.
     * @param baseUrl - The base url that the Autocomplete is to use for fetching suggestions.
     * @param settings - The settings for how the Autocomplete is to operate.
     * @param auth - The object that handles authentication.
     */
    constructor(
        baseUrl: string,
        protected settings?: AutocompleteSettings,
        auth?: AuthToken,
        fetchMethod?: Fetch
    ) {
        super();
        settings = new AutocompleteSettings(settings);
        auth = auth || new AuthToken();
        super.init(baseUrl, settings, auth, fetchMethod);
        this.queryConverter = new AutocompleteQueryConverter();
    }

    /**
     * When called it will execute a rest-call to the base-url and fetch sutocomplete suggestions based on the query passed.
     * Note that if a request callback has been setup then if it returns false the request is skipped.
     * @param query - Is used to find out which autocomplete suggestions and from what sources they should be retrieved.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a Promise that when resolved returns a string array of suggestions (or undefined if a callback stops the request).
     */
    public fetch(
        query: Query = new Query(),
        suppressCallbacks: boolean = false
    ): Promise<string[]> {
        let url = this.queryConverter.getUrl(
            this.baseUrl,
            this.settings.url,
            new Query(query)
        );
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
            return this.fetchMethod(url, reqInit)
                .then((response: Response) => {
                    if (!response.ok) {
                        throw Error(
                            `${response.status} ${
                                response.statusText
                            } for request url '${url}'`
                        );
                    }
                    return response.json();
                })
                .then((suggestions: string[]) => {
                    this.cbSuccess(
                        suppressCallbacks,
                        suggestions,
                        url,
                        reqInit
                    );
                    return suggestions;
                })
                .catch(error => {
                    this.cbError(suppressCallbacks, error, url, reqInit);
                    return Promise.reject(error);
                });
        } else {
            // TODO: When a fetch is stopped due to cbRequest returning false, should we:
            // 1) Reject the promise (will then be returned as an error).
            // or
            // 2) Resolve the promise (will then be returned as a success).
            // or
            // 3) should we do something else (old code returned undefined...)
            return Promise.resolve(null);
        }
    }

    public maxSuggestionsChanged(oldValue: number, query: Query) {
        if (
            this.shouldUpdate() &&
            this.settings.triggers.maxSuggestionsChanged
        ) {
            this.update(query);
        }
    }

    public queryTextChanged(oldValue: string, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.queryChange) {
            if (
                query.queryText.length >
                this.settings.triggers.queryChangeMinLength
            ) {
                if (
                    this.settings.triggers.queryChangeInstantRegex &&
                    this.settings.triggers.queryChangeInstantRegex.test(
                        query.queryText
                    )
                ) {
                    this.update(query);
                    return;
                } else {
                    if (this.settings.triggers.queryChangeDelay > -1) {
                        this.update(
                            query,
                            this.settings.triggers.queryChangeDelay
                        );
                        return;
                    }
                }
            }
        }
        clearTimeout(this.delay);
    }

    // TODO: In the future we may differ on what autocomplete suggestions to suggest depending on the searchtype.
    //public searchTypeChanged(oldValue: SearchType, query: CategorizeQuery) { }

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
