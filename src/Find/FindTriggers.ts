import { ICategorizeTriggers } from '../Categorize/CategorizeTriggers';

/**
 * These are the triggers that define when and when not to trigger a find lookup.
 */
export interface IFindTriggers extends ICategorizeTriggers {
    /**
     * Triggers when the generateContent property has changed.
     * 
     * Note: Only available for v4+.
     */
    matchGenerateContentChanged?: boolean;

    /**
     * Triggers when the generateContentHighlights property has changed.
     * 
     * Note: Only available for v4+.
     */
    matchGenerateContentHighlightsChanged?: boolean;

    /**
     * Triggers when the useGrouping property has changed.
     */
    matchGroupingChanged?: boolean;

    /**
     * Triggers when the orderBy property has changed.
     */
    matchOrderByChanged?: boolean;

    /**
     * Triggers when the page property has changed.
     */
    matchPageChanged?: boolean;

    /**
     * Triggers when the pageSize property has changed.
     */
    matchPageSizeChanged?: boolean;

    /**
     * Triggers when the uiLanguageCode property has changed.
     * Note: Overrides the default set in CategorizeTriggers.
     * Default: Do not refetch on change - as there are no language-dependent data in the find-response.
     */
    uiLanguageCodeChanged?: boolean;
}

/**
 * These are the triggers that define when and when not to trigger a find lookup.
 */
export class FindTriggers implements IFindTriggers {
    
    // IBaseTriggers

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
     * @override BaseTriggers
     */
    public queryChangeMinLength?: number = 2;

    // ICategorizeTriggers

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
     * Triggers when the searchType property has changed.
     */
    public searchTypeChanged?: boolean = true;

    /**
     * Triggers when the uiLanguageCode property has changed.
     * Note: Overrides the default set in CategorizeTriggers.
     * Default: Do not refetch on change - as there are no language-dependent data in the find-response.
     */
    public uiLanguageCodeChanged?: boolean = false;

    // IFindTriggers
    
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
     * Creates a FindTrigger object for you, based on FindTrigger defaults and the overrides provided as a param.
     * @param triggers - The trigger defined here will override the default FindTrigger.
     */
    constructor(triggers?: IFindTriggers) {
        if (triggers) {
            this.queryChange = typeof triggers.queryChange !== "undefined" ? triggers.queryChange : this.queryChange;
            this.queryChangeDelay = typeof triggers.queryChangeDelay !== "undefined" ? triggers.queryChangeDelay : this.queryChangeDelay;
            this.queryChangeInstantRegex = typeof triggers.queryChangeInstantRegex !== "undefined" ? triggers.queryChangeInstantRegex : this.queryChangeInstantRegex;
            this.queryChangeMinLength = typeof triggers.queryChangeMinLength !== "undefined" ? triggers.queryChangeMinLength : this.queryChangeMinLength;

            this.clientCategoryFilterChanged = typeof triggers.clientCategoryFilterChanged !== "undefined" ? triggers.clientCategoryFilterChanged : this.clientCategoryFilterChanged;
            this.clientIdChanged = typeof triggers.clientIdChanged !== "undefined" ? triggers.clientIdChanged : this.clientIdChanged;
            this.dateFromChanged = typeof triggers.dateFromChanged !== "undefined" ? triggers.dateFromChanged : this.dateFromChanged;
            this.dateToChanged = typeof triggers.dateToChanged !== "undefined" ? triggers.dateToChanged : this.dateToChanged;
            this.filterChanged = typeof triggers.filterChanged !== "undefined" ? triggers.filterChanged : this.filterChanged;
            this.searchTypeChanged = typeof triggers.searchTypeChanged !== "undefined" ? triggers.searchTypeChanged : this.searchTypeChanged;
            this.uiLanguageCodeChanged = typeof triggers.uiLanguageCodeChanged !== "undefined" ? triggers.uiLanguageCodeChanged : this.uiLanguageCodeChanged;

            this.matchGenerateContentChanged = typeof triggers.matchGenerateContentChanged !== "undefined" ? triggers.matchGenerateContentChanged : this.matchGenerateContentChanged;
            this.matchGenerateContentHighlightsChanged = typeof triggers.matchGenerateContentHighlightsChanged !== "undefined" ? triggers.matchGenerateContentHighlightsChanged : this.matchGenerateContentHighlightsChanged;
            this.matchGroupingChanged = typeof triggers.matchGroupingChanged !== "undefined" ? triggers.matchGroupingChanged : this.matchGroupingChanged;
            this.matchOrderByChanged = typeof triggers.matchOrderByChanged !== "undefined" ? triggers.matchOrderByChanged : this.matchOrderByChanged;
            this.matchPageChanged = typeof triggers.matchPageChanged !== "undefined" ? triggers.matchPageChanged : this.matchPageChanged;
            this.matchPageSizeChanged = typeof triggers.matchPageSizeChanged !== "undefined" ? triggers.matchPageSizeChanged : this.matchPageSizeChanged;
        }
    }
}
