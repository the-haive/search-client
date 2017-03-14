import { BaseSettings } from '../Common/BaseSettings';

import { AutocompleteTriggers } from './AutocompleteTriggers';

/**
 * These are all the settings that can affect the returned suggestions for autocomplete() lookups.
 */
export class AutocompleteSettings extends BaseSettings<string[]> {

    /**
     * The trigger-settings for when automatic suggestion updates are to be triggered.
     */
    public triggers?: AutocompleteTriggers = new AutocompleteTriggers();

    /**
     * The endpoint to do autocomplete lookups for.
     */
    public url?: string = '/autocomplete';

    /**
     * Creates an AutocompleteSettings object for you, based on AutocompleteSettings defaults and the overrides provided as a param.
     * @param autocompleteSettings - The settings defined here will override the default AutocompleteSettings.
     */
    constructor(autocompleteSettings?: AutocompleteSettings) {
        super(autocompleteSettings);
        if (autocompleteSettings) {
            autocompleteSettings.triggers = new AutocompleteTriggers(autocompleteSettings.triggers);
        }
        Object.assign(this, autocompleteSettings);
    }

}
