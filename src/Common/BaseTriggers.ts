export abstract class BaseTriggers {
    
    /**
     * Turns on or off all query-related triggers.
     */
    public queryChange?: boolean = true;

    /**
     * Min length before triggering. 
     * 
     * Note: Requires queryChanged to be true.
     */
    public queryChangeMinLength?: number = 3;

    /** 
     * Triggers action immediately instead of delayed when the query matches the regex.
     * 
     * Note: Requires queryChanged to be true.
     * Note: Requires query to be longer than queryMinLength.
     * 
     * Default: Trigger on first whitespace after non-whitespace
     */
    public queryChangeInstantRegex?: RegExp = /\S\s$/;

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
    public queryChangeDelay?: number = 200;    

}
