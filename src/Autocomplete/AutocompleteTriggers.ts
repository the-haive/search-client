import { BaseTriggers } from '../Common/BaseTriggers';

/**
 * These are the triggers that define when and when not to trigger an autocomplete lookup.
 */
export class AutocompleteTriggers extends BaseTriggers {

    /**
     * Whether or not an autocomplete lookup should be done when the maxSuggestions setting is changed. 
     * 
     * Note: Requires queryChanged to be true.
     */
    public maxSuggestionsChanged?: boolean = true;

    /**
     * Creates an AutocompleteTrigger object for you, based on AutocompleteTrigger defaults and the overrides provided as a param.
     * 
     * @param triggers - The trigger defined here will override the default AutocompleteTrigger.
     */
    constructor(triggers?: AutocompleteTriggers) {
        super(triggers);

        if (triggers) {
            this.maxSuggestionsChanged = typeof triggers.maxSuggestionsChanged !== "undefined" ? triggers.maxSuggestionsChanged : this.maxSuggestionsChanged;
        }
    }

}
