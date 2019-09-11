/**
 * These are the triggers that define when and when not to trigger a categorize lookup.
 */
export class CategorizeTriggers {
    /**
     * Triggers when the categorizationType has changed.
     * Default: true
     */
    public categorizationTypeChanged?: boolean;

    /**
     * Triggers when the clientId property has changed.
     * Default: true
     */
    public clientIdChanged?: boolean;

    /**
     * Triggers when the from date property has changed.
     * Default: true
     */
    public dateFromChanged?: boolean;

    /**
     * Triggers when the to date property has changed.
     * Default: true
     */
    public dateToChanged?: boolean;

    /**
     * Triggers when the filter property has changed.
     * Default: true
     */
    public filtersChanged?: boolean;

    /**
     * Turns on or off all query-related triggers.
     * Default: false
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
     * Default: 2000 - Run delayed lookups after 2 seconds.
     * Note: Queries matching the queryChangeInstantRegex will run immediately though.
     */
    public queryChangeDelay?: number;

    /**
     * Triggers action immediately instead of delayed when the query matches the regex.
     *
     * Note: Requires queryChange to be true.
     * Note: Requires query to be longer than queryMinLength.
     *
     * Default: /\S\s$/ - Trigger on first ENTER or SPACE. Sample: https://regex101.com/r/P0xfej/2
     */
    public queryChangeInstantRegex?: RegExp;

    /**
     * Min length before triggering. For Categorize (and Find) this should be ok with short queries too.
     * One character followed by an enter (default).
     *
     * Note: Requires queryChange to be true.
     *
     * Default: 2
     */
    public queryChangeMinLength?: number;

    /**
     * Triggers when the searchType property has changed. Default: true
     * Default: true
     */
    public searchTypeChanged?: boolean;

    /**
     * Triggers when the uiLanguageCode property has changed.
     * Default: true - Re-fetch on change - as the categories normally are translated.
     */
    public uiLanguageCodeChanged?: boolean;

    /**
     * Creates a CategorizeTrigger object for you, based on CategorizeTrigger defaults and the overrides provided as a param.
     *
     * @param triggers - The triggers defined here will override the default CategorizeTrigger.
     */
    constructor(triggers: CategorizeTriggers = {}) {
        this.categorizationTypeChanged =
            typeof triggers.categorizationTypeChanged !== "undefined"
                ? triggers.categorizationTypeChanged
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

        this.filtersChanged =
            typeof triggers.filtersChanged !== "undefined"
                ? triggers.filtersChanged
                : true;

        this.queryChange =
            typeof triggers.queryChange !== "undefined"
                ? triggers.queryChange
                : false;

        this.queryChangeDelay =
            typeof triggers.queryChangeDelay !== "undefined"
                ? triggers.queryChangeDelay
                : 2000;

        this.queryChangeInstantRegex =
            typeof triggers.queryChangeInstantRegex !== "undefined"
                ? triggers.queryChangeInstantRegex
                : /\S\s$/;

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
                : true;
    }
}
