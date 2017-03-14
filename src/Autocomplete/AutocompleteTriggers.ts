import { BaseTriggers } from '../Common/BaseTriggers';

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
     * @param autocompleteTrigger - The trigger defined here will override the default AutocompleteTrigger.
     */
    constructor(autocompleteTrigger?: AutocompleteTriggers) {
        super();
        Object.assign(this, autocompleteTrigger);
    }

}
