import { BaseSettings } from '../Common/BaseSettings';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class BestBetsSettings extends BaseSettings<string[]> {

    /**
     * The endpoint to do categorize lookups for.
     */
    public url?: string = 'manage/bestbets';

    /**
     * Creates a BestBetsSettings object for you, based on BestBetsSettings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default BestBetsSettings.
     */
    constructor(settings?: BestBetsSettings) {
        super(settings);
        
        if (settings) {
            this.url = typeof settings.url !== "undefined" ? settings.url : this.url;
        }
        
        // Remove leading and trailing slashes from the url
        this.url = this.url.replace(/(^\/+)|(\/+$)/g, "");
    }

}
