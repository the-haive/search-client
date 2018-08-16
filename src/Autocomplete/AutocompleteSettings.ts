import { BaseSettings } from '../Common';
import { AutocompleteTriggers } from '.';

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
    public url?: string = 'autocomplete';

    /**
     * Creates an AutocompleteSettings object for you, based on AutocompleteSettings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default AutocompleteSettings.
     */
    constructor(settings?: AutocompleteSettings) {
        super(settings);
        
        if (settings) {
            this.triggers = typeof settings.triggers !== 'undefined' ? new AutocompleteTriggers(settings.triggers) : this.triggers;
            this.url = typeof settings.url !== 'undefined' ? settings.url : this.url;
        }
        
        // Remove leading and trailing slashes from the url
        this.url = this.url.replace(/(^\/+)|(\/+$)/g, '');
    }

}
