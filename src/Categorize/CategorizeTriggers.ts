import { BaseTriggers } from '../Common/BaseTriggers';

export class CategorizeTriggers extends BaseTriggers {
    
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
     * Min length before triggering. For Categorize (and Find) this should be ok with short queries too. 
     * One character followed by an enter (default).
     * 
     * Note: Requires queryChanged to be true.
     */
    public queryChangeMinLength?: number = 2;

    /** 
     * Triggers action immediately instead of delayed when the query matches the regex.
     * 
     * Note: Requires queryChanged to be true.
     * Note: Requires query to be longer than queryMinLength.
     * 
     * Default: Trigger on first ENTER after non-whitespace (i.e. user presses enter at the end of the query-field, 
     * if it is a "multiline"" and accepts the enter").
     */
    public queryChangeInstantRegex?: RegExp = /\S\n$/;

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
     */
    public queryChangeDelay?: number = -1;    

    /**
     * Triggers when the searchType property has changed.
     */
    public searchTypeChanged?: boolean = true;

    /**
     * Creates a CategorizeTrigger object for you, based on CategorizeTrigger defaults and the overrides provided as a param.
     * 
     * @param categorizeTrigger - The trigger defined here will override the default CategorizeTrigger.
     */
    constructor(categorizeTrigger?: CategorizeTriggers) {
        super();
        Object.assign(this, categorizeTrigger);
    }

}
