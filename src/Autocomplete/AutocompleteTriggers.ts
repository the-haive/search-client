/**
 * These are the triggers that define when and when not to trigger an autocomplete lookup.
 */
export class AutocompleteTriggers {
    //} implements IAutocompleteTriggers {
    /**
     * Whether or not an autocomplete lookup should be done when the maxSuggestions setting is changed.
     *
     * Note: Requires queryChanged to be true.
     */
    public maxSuggestionsChanged?: boolean;

    /**
     * Turns on or off all query-related triggers.
     */
    public queryChange?: boolean;

    /**
     * Delay triggers until changes has not been made to the query for a certain time (milliseconds).
     * This is to avoid executing searches constantly while the user is typing.
     *
     * The queryChangeInstantRegex has precedence. This delay is only considered when that regex doesn't match.
     * Set value to less than zero to make sure we only trigger when the queryChangeInstantRegex matches.
     *
     * Note: Requires queryChanged to be true.
     * Note: Requires query to be longer than queryMinLength.
     */
    public queryChangeDelay?: number;

    /**
     * Triggers action immediately instead of delayed when the query matches the regex.
     *
     * Note: Requires queryChange to be true.
     * Note: Requires query to be longer than queryChangeMinLength.
     *
     * Default: Trigger on first whitespace after non-whitespace
     */
    public queryChangeInstantRegex?: RegExp;

    /**
     * Min length before triggering.
     *
     * Note: Requires queryChange to be true.
     */
    public queryChangeMinLength?: number;

    /**
     * Creates an AutocompleteTrigger object for you, based on AutocompleteTrigger defaults and the overrides provided as a param.
     *
     * @param triggers - The trigger defined here will override the default AutocompleteTrigger.
     */
    constructor(triggers: AutocompleteTriggers = {}) {
        this.maxSuggestionsChanged =
            typeof triggers.maxSuggestionsChanged !== "undefined"
                ? triggers.maxSuggestionsChanged
                : true;

        this.queryChange =
            typeof triggers.queryChange !== "undefined"
                ? triggers.queryChange
                : true;

        this.queryChangeDelay =
            typeof triggers.queryChangeDelay !== "undefined"
                ? triggers.queryChangeDelay
                : 200;

        this.queryChangeInstantRegex =
            typeof triggers.queryChangeInstantRegex !== "undefined"
                ? triggers.queryChangeInstantRegex
                : /\S\s$/;

        this.queryChangeMinLength =
            typeof triggers.queryChangeMinLength !== "undefined"
                ? triggers.queryChangeMinLength
                : 3;
    }
}
