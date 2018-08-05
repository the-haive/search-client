/**
 * These are the triggers that define when and when not to trigger a find lookup.
 */
export class FindTriggers { //implements IFindTriggers {
    /**
     * Triggers when the clientCategoryFilter is changed.
     */
    public clientCategoryFilterChanged?: boolean = true;

    /**
     * Triggers when the clientId property has changed
     */
    public clientIdChanged?: boolean = true;

    /**
     * Triggers when the from date property has changed.
     */
    public dateFromChanged?: boolean = true;

    /**
     * Triggers when the to date property has changed.
     */
    public dateToChanged?: boolean = true;

    /**
     * Triggers when the filter property has changed.
     */
    public filterChanged?: boolean = true;

    /**
     * Triggers when the generateContent property has changed.
     *
     * Note: Only available for v4+.
     */
    public matchGenerateContentChanged?: boolean = true;

    /**
     * Triggers when the generateContentHighlights property has changed.
     *
     * Note: Only available for v4+.
     */
    public matchGenerateContentHighlightsChanged?: boolean = true;

    /**
     * Triggers when the useGrouping property has changed.
     */
    public matchGroupingChanged?: boolean = true;

    /**
     * Triggers when the orderBy property has changed.
     */
    public matchOrderByChanged?: boolean = true;

    /**
     * Triggers when the page property has changed.
     */
    public matchPageChanged?: boolean = true;

    /**
     * Triggers when the pageSize property has changed.
     */
    public matchPageSizeChanged?: boolean = true;

    /**
     * Turns on or off all query-related triggers.
     */
    public queryChange?: boolean = true;

    /**
     * Delay triggers until changes has not been made to the query for a certain time (milliseconds).
     * This is to avoid executing searches constantly while the user is typing.
     * The queryChangeInstantRegex has precedence. This delay is only considered when that regex doesn't match.
     * Set value to less than zero to make sure we only trigger when the queryChangeInstantRegex matches.
     *
     * Note: Requires queryChanged to be true.
     * Note: Requires query to be longer than queryMinLength.
     *
     * Default for Categorize is to not run delayed lookups and instead only do that for queryChangeInstantRegex matches.
     * @override BaseTriggers
     */
    public queryChangeDelay?: number = -1;

    /**
     * Triggers action immediately instead of delayed when the query matches the regex.
     *
     * Note: Requires queryChanged to be true.
     * Note: Requires query to be longer than queryMinLength.
     *
     * Default: Trigger on first ENTER after non-whitespace (i.e. user presses enter at the end of the query-field,
     * if it is a "multiline"" and accepts the enter").
     * @override BaseTriggers
     */
    public queryChangeInstantRegex?: RegExp = /\S\n$/;

    /**
     * Min length before triggering. For Categorize (and Find) this should be ok with short queries too.
     * One character followed by an enter (default).
     *
     * Note: Requires queryChanged to be true.
     */
    public queryChangeMinLength?: number = 2;
    /**
     * Triggers when the searchType property has changed.
     */
    public searchTypeChanged?: boolean = true;

    /**
     * Triggers when the uiLanguageCode property has changed.
     * Note: Overrides the default set in CategorizeTriggers.
     * Default: Do not refetch on change - as there are no language-dependent data in the find-response.
     */
    public uiLanguageCodeChanged?: boolean = false;

    /**
     * Creates a FindTrigger object for you, based on FindTrigger defaults and the overrides provided as a param.
     * @param triggers - The trigger defined here will override the default FindTrigger.
     */
    constructor(triggers: FindTriggers = {} as FindTriggers) {
        Object.assign(this, triggers);
    }
}
