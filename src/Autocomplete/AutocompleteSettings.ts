import { SearchSettings } from '../Common/SearchSettings';

import { AutocompleteTrigger } from './AutocompleteTrigger';

/**
 * These are all the settings that can affect the returned suggestions for autocomplete() lookups.
 */
export class AutocompleteSettings extends SearchSettings<string[]> {

    /**
     * The trigger-settings for when automatic suggestion updates are to be triggered.
     */
    public trigger: AutocompleteTrigger = new AutocompleteTrigger();

    /**
     * The endpoint to do autocomplete lookups for.
     */
    public url: string = '/autocomplete';

    /**
     * Creates an AutocompleteSettings object for you, based on AutocompleteSettings defaults and the overrides provided as a param.
     * @param autocompleteSettings - The settings defined here will override the default AutocompleteSettings.
     */
    constructor(autocompleteSettings?: AutocompleteSettings) {
        super(autocompleteSettings);
        if (autocompleteSettings) {
            autocompleteSettings.trigger = new AutocompleteTrigger(autocompleteSettings.trigger);
        }
        Object.assign(this, autocompleteSettings);
    }

}
