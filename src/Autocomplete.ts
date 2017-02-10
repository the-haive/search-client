import { AutocompleteSettings } from './AutocompleteSettings';

/**
 * Defines the parameters for the autocomplete() call.
 */
export class Autocomplete extends AutocompleteSettings {

    /**
     * The constructor can either take the listed params as function arguments, or you can send in a object with each of the listed params as keys (JSON notation).
     * 
     * @param queryText - The text to find autocomplete suggestions for. @default "".
     * @param maxSuggestions - The number of suggestions to return. @default 10.
     * @param minQueryLength - The minimum length before starting to create suggestions. @default 2.
     */
    constructor(queryText?: string | AutocompleteSettings, maxSuggestions?: number, minQueryLength?: number) {
        super();
        let o: AutocompleteSettings = typeof queryText === "object" ? queryText : {} as AutocompleteSettings;
        this.queryText = o.queryText || queryText as string || '';
        this.maxSuggestions = o.maxSuggestions || maxSuggestions || 10;
        this.minQueryLength = o.minQueryLength || minQueryLength || 2;
    }

    /**
     * Returns the specific rest-path segment for the autocomplete url.
     */
    public toUrlParam(): string {
        let params: string[] = [];

        params.push(`q=${encodeURIComponent(this.queryText)}`);
        params.push(`s=${encodeURIComponent(this.maxSuggestions.toString())}`);
        params.push(`l=${encodeURIComponent(this.minQueryLength.toString())}`);

        return `?${params.join('&')}`;
    }
}
