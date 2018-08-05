import { BaseSettings } from '../Common';
import { Categories } from '../Data';
import { CategorizeTriggers } from '.';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class CategorizeSettings extends BaseSettings<Categories> {

    /**
     * This is the separator-character that is used when comparing the clientCategoryFilters. You need to use this
     * to join categoryName arrays in the filter section. See [[SearchClient.clientCategoryFilters]].
     */
    public clientCategoryFiltersSepChar?: string = '_';

    /**
     * The trigger-settings for when automatic category result-updates are to be triggered.
     */
    public triggers?: CategorizeTriggers = new CategorizeTriggers();

    /**
     * The endpoint to do categorize lookups for.
     */
    public url?: string = 'search/categorize';

    /**
     * Creates an instance of CategorizeSettings, based on CategorizeSettings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default CategorizeSettings.
     */
    constructor(settings?: CategorizeSettings) {
        super(settings);
        if (settings) {
            this.clientCategoryFiltersSepChar = typeof settings.clientCategoryFiltersSepChar !== 'undefined' ? settings.clientCategoryFiltersSepChar : this.clientCategoryFiltersSepChar;
            this.triggers = typeof settings.triggers !== 'undefined' ? new CategorizeTriggers(settings.triggers) : this.triggers;
            this.url = typeof settings.url !== 'undefined' ? settings.url : this.url;
        }
        
        // Remove leading and trailing slashes from the url
        this.url = this.url.replace(/(^\/+)|(\/+$)/g, '');
    }
}
