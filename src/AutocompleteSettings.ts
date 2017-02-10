/**
 * These are all the settings that can affect the returned suggestions for autocomplete() lookups.
 */
export class AutocompleteSettings {

    /**
     * The queryText to search for. Normally not set in settings, as they are normally set runtime from the queryfield.
     */
    public queryText?: string;

    /**
     * Max number of suggestions to return.
     * @default SearchType.Keywords
     */
    public maxSuggestions?: number;

    /**
     * Min query-length before doing autocomplete lookup.
     * @default SearchType.Keywords
     */
    public minQueryLength?: number;
}
