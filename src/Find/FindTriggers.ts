/**
 * These are the triggers that define when and when not to trigger a find lookup.
 */
export class FindTriggers {
    /**
     * Triggers when the clientCategoryFilter is changed.
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
     * Triggers when the generateContent property has changed.
     */
    public matchGenerateContentChanged?: boolean;

    /**
     * Triggers when the generateContentHighlights property has changed.
     */
    public matchGenerateContentHighlightsChanged?: boolean;

    /**
     * Triggers when the useGrouping property has changed.
     */
    public matchGroupingChanged?: boolean;

    /**
     * Triggers when the orderBy property has changed.
     */
    public matchOrderByChanged?: boolean;

    /**
     * Triggers when the page property has changed.
     */
    public matchPageChanged?: boolean;

    /**
     * Triggers when the pageSize property has changed.
     */
    public matchPageSizeChanged?: boolean;

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
     * Default for Find is to run delayed lookups after 2 seconds. The queryChangeInstantRegex matches will
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
     * Triggers when the searchType property has changed. Default: true
     */
    public searchTypeChanged?: boolean;

    /**
     * Triggers when the uiLanguageCode property has changed.
     * Note: Overrides the default set in CategorizeTriggers.
     * Default: Do not re-fetch on change - as there are no language-dependent data in the find-response.
     */
    public uiLanguageCodeChanged?: boolean;

    /**
     * Creates a FindTrigger object for you, based on FindTrigger defaults and the overrides provided as a param.
     * @param triggers - The trigger defined here will override the default FindTrigger.
     */
    constructor(triggers: FindTriggers = {}) {
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
        this.matchGenerateContentChanged =
            typeof triggers.matchGenerateContentChanged !== "undefined"
                ? triggers.matchGenerateContentChanged
                : true;
        this.matchGenerateContentHighlightsChanged =
            typeof triggers.matchGenerateContentHighlightsChanged !==
            "undefined"
                ? triggers.matchGenerateContentHighlightsChanged
                : true;
        this.matchGroupingChanged =
            typeof triggers.matchGroupingChanged !== "undefined"
                ? triggers.matchGroupingChanged
                : true;
        this.matchOrderByChanged =
            typeof triggers.matchOrderByChanged !== "undefined"
                ? triggers.matchOrderByChanged
                : true;
        this.matchPageChanged =
            typeof triggers.matchPageChanged !== "undefined"
                ? triggers.matchPageChanged
                : true;
        this.matchPageSizeChanged =
            typeof triggers.matchPageSizeChanged !== "undefined"
                ? triggers.matchPageSizeChanged
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
                : true;
        this.uiLanguageCodeChanged =
            typeof triggers.uiLanguageCodeChanged !== "undefined"
                ? triggers.uiLanguageCodeChanged
                : false;
    }
}
