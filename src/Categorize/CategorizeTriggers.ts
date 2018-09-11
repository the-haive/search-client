/**
 * These are the triggers that define when and when not to trigger a categorize lookup.
 */
export class CategorizeTriggers {
    /**
     * Triggers when the clientCategoryExpansion has changed.
     */
    public clientCategoryExpansionChanged?: boolean;

    /**
     * Triggers when the clientCategoryFilter has changed.
     */
    public clientCategoryFilterChanged?: boolean;

    /**
     * Triggers when the clientId property has changed
     */
    public clientIdChanged?: boolean;

    /**
     * Triggers when the from date property has changed.
     */
    public dateFromChanged?: boolean;

    /**
     * Triggers when the to date property has changed.
     */
    public dateToChanged?: boolean;

    /**
     * Triggers when the filter property has changed.
     */
    public filterChanged?: boolean;

    /**
     * Turns on or off all query-related triggers.
     */
    public queryChange?: boolean;

    /**
     * Delay triggers until changes has not been made to the query for a certain time (milliseconds).
     * This is to avoid executing searches constantly while the user is typing.
     * The queryChangeInstantRegex has precedence. This delay is only considered when that regex doesn't match.
     * Set value to less than zero to make sure we only trigger when the queryChangeInstantRegex matches.
     *
     * Note: Requires queryChange to be true.
     * Note: Requires query to be longer than queryMinLength.
     *
     * Default for Categorize is to run delayed lookups after 2 seconds. The queryChangeInstantRegex matches will
     * run immediately though.
     */
    public queryChangeDelay?: number;

    /**
     * Triggers action immediately instead of delayed when the query matches the regex.
     *
     * Note: Requires queryChange to be true.
     * Note: Requires query to be longer than queryMinLength.
     *
     * Default: Trigger on first ENTER or SPACE. Sample: https://regex101.com/r/P0xfej/1
     */
    public queryChangeInstantRegex?: RegExp;

    /**
     * Min length before triggering. For Categorize (and Find) this should be ok with short queries too.
     * One character followed by an enter (default).
     *
     * Note: Requires queryChange to be true.
     */
    public queryChangeMinLength?: number;

    /**
     * Triggers when the searchType property has changed.
     */
    public searchTypeChanged?: boolean;

    /**
     * Triggers when the uiLanguageCode property has changed.
     * Default: Re-fetch on change - as the categories normally are translated.
     */
    public uiLanguageCodeChanged?: boolean;

    /**
     * Creates a CategorizeTrigger object for you, based on CategorizeTrigger defaults and the overrides provided as a param.
     *
     * @param triggers - The triggers defined here will override the default CategorizeTrigger.
     */
    constructor(triggers: CategorizeTriggers = {}) {
        this.clientCategoryExpansionChanged =
            typeof triggers.clientCategoryExpansionChanged !== "undefined"
                ? triggers.clientCategoryExpansionChanged
                : true;

        this.clientCategoryFilterChanged =
            typeof triggers.clientCategoryFilterChanged !== "undefined"
                ? triggers.clientCategoryFilterChanged
                : true;

        this.clientIdChanged =
            typeof triggers.clientIdChanged !== "undefined"
                ? triggers.clientIdChanged
                : true;

        this.dateFromChanged =
            typeof triggers.dateFromChanged !== "undefined"
                ? triggers.dateFromChanged
                : true;

        this.dateToChanged =
            typeof triggers.dateToChanged !== "undefined"
                ? triggers.dateToChanged
                : true;

        this.filterChanged =
            typeof triggers.filterChanged !== "undefined"
                ? triggers.filterChanged
                : true;

        this.queryChange =
            typeof triggers.queryChange !== "undefined"
                ? triggers.queryChange
                : true;

        this.queryChangeDelay =
            typeof triggers.queryChangeDelay !== "undefined"
                ? triggers.queryChangeDelay
                : 2000;

        this.queryChangeInstantRegex =
            typeof triggers.queryChangeInstantRegex !== "undefined"
                ? triggers.queryChangeInstantRegex
                : /\S\s$/u;

        this.queryChangeMinLength =
            typeof triggers.queryChangeMinLength !== "undefined"
                ? triggers.queryChangeMinLength
                : 2;

        this.searchTypeChanged =
            typeof triggers.searchTypeChanged !== "undefined"
                ? triggers.searchTypeChanged
                : false;

        this.uiLanguageCodeChanged =
            typeof triggers.uiLanguageCodeChanged !== "undefined"
                ? triggers.uiLanguageCodeChanged
                : true;
    }
}
