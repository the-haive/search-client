export interface IBaseTriggers {
    
    /**
     * Turns on or off all query-related triggers.
     */
    queryChange?: boolean;

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
    queryChangeDelay?: number;    

    /** 
     * Triggers action immediately instead of delayed when the query matches the regex.
     * 
     * Note: Requires queryChanged to be true.
     * Note: Requires query to be longer than queryMinLength.
     * 
     * Default: Trigger on first whitespace after non-whitespace
     */
    queryChangeInstantRegex?: RegExp;

    /**
     * Min length before triggering. 
     * 
     * Note: Requires queryChanged to be true.
     */
    queryChangeMinLength?: number;
}

// export abstract class BaseTriggers implements IBaseTriggers {
    
//     /**
//      * Turns on or off all query-related triggers.
//      */
//     public queryChange?: boolean = true;

//     /**
//      * Delay triggers until changes has not been made to the query for a certain time (milliseconds). 
//      * This is to avoid executing searches constantly while the user is typing.
//      * 
//      * The queryChangeInstantRegex has precedence. This delay is only considered when that regex doesn't match.
//      * Set value to less than zero to make sure we only trigger when the queryChangeInstantRegex matches.
//      * 
//      * Note: Requires queryChanged to be true.
//      * Note: Requires query to be longer than queryMinLength.
//      */
//     public queryChangeDelay?: number = 200;    

//     /** 
//      * Triggers action immediately instead of delayed when the query matches the regex.
//      * 
//      * Note: Requires queryChanged to be true.
//      * Note: Requires query to be longer than queryMinLength.
//      * 
//      * Default: Trigger on first whitespace after non-whitespace
//      */
//     public queryChangeInstantRegex?: RegExp = /\S\s$/;

//     /**
//      * Min length before triggering. 
//      * 
//      * Note: Requires queryChanged to be true.
//      */
//     public queryChangeMinLength?: number = 3;

//     /**
//      * @param triggers - The trigger settings defined here will override the default trigger settings.
//      */
//     constructor(triggers: BaseTriggers) {
//         if (triggers) {
//             this.queryChange = typeof triggers.queryChange !== "undefined" ? triggers.queryChange : this.queryChange;
//             this.queryChangeDelay = typeof triggers.queryChangeDelay !== "undefined" ? triggers.queryChangeDelay : this.queryChangeDelay;
//             this.queryChangeInstantRegex = typeof triggers.queryChangeInstantRegex !== "undefined" ? triggers.queryChangeInstantRegex : this.queryChangeInstantRegex;
//             this.queryChangeMinLength = typeof triggers.queryChangeMinLength !== "undefined" ? triggers.queryChangeMinLength : this.queryChangeMinLength;
//         }
//     }

// }
