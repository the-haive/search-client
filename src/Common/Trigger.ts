export class Trigger {
    
    /**
     * Turns on or off all query-related triggers, except queryEnter.
     */
    public queryChanged: boolean = false;

    /**
     * Delay triggers until changes has not been made to the query for a certain time (milliseconds). 
     * This is to avoid executing searches constantly while the user is typing.
     */
    public queryChangeTriggerDelay: number = 200;    

    /**
     * Min length before triggering. 
     * Note: Requires queryChanged to be true.
     */
    public queryMinLength: number = 3;

    /** 
     * Triggers action immediately instead of delayed when the query matches the regex.
     * Note: Requires queryChanged to be true.
     * Note: Requires query to be longer than queryMinLength.
     * Default: Trigger on first whitespace after non-whitespace
     */
    public queryChangeUndelayedRegex: RegExp = /\S\s$/;
}
