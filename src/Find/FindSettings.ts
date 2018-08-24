import { BaseSettings } from '../Common';
import { FindTriggers } from './FindTriggers';
import { Matches } from '../Data';

/**
 * These are all the settings that can affect the returned categories for Find() lookups.
 */
export class FindSettings extends BaseSettings<Matches> {

    /**
     * The trigger-settings for when automatic match result-updates are to be triggered.
     */
    public triggers?: FindTriggers = new FindTriggers();

    /**
     * The endpoint to do Find lookups for.
     */
    public url?: string = '/search/find';

    /**
     * Creates a FindSettings object for you, based on FindSettings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default FindSettings.
     */
    constructor(settings?: FindSettings) {
        super(settings);
        
        if (settings) {
            this.triggers = typeof settings.triggers !== 'undefined' ? new FindTriggers(settings.triggers) : this.triggers;
            this.url = typeof settings.url !== 'undefined' ? settings.url : this.url;
        }
        
        // Remove leading and trailing slashes from the url
        this.url = this.url.replace(/(^\/+)|(\/+$)/g, '');
    }
}
