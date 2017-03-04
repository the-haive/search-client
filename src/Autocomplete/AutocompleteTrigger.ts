import { Trigger } from '../Common/Trigger';

export class AutocompleteTrigger extends Trigger {

    /**
     * Whether or not an autocomplete lookup should be done when the maxSuggestions setting is changed. 
     * Note: Requires queryChanged to be true.
     */
    public maxSuggestionsChanged: boolean = true;
}
