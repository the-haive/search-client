import { BaseSettings } from '../Common/BaseSettings';
import { Categories } from '../Data/Categories';

import { CategorizeTriggers } from './CategorizeTriggers';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class CategorizeSettings extends BaseSettings<Categories> {

    /**
     * The trigger-settings for when automatic category result-updates are to be triggered.
     */
    public triggers?: CategorizeTriggers = new CategorizeTriggers();

    /**
     * The endpoint to do categorize lookups for.
     */
    public url?: string = '/search/categorize';

    /**
     * This is the separator-character that is used when comparing the clientCategoryFilters. You need to use this
     * to join categoryName arrays in the filter section. See [[SearchClient.clientCategoryFilters]].
     */
    public clientCategoryFiltersSepChar?: string = "_";

    /**
     * Creates an instance of CategorizeSettings, based on CategorizeSettings defaults and the overrides provided as a param.
     * @param categorizeSettings - The settings defined here will override the default CategorizeSettings.
     */
    constructor(categorizeSettings?: CategorizeSettings) {
        super(categorizeSettings);
        if (categorizeSettings) {
            categorizeSettings.triggers = new CategorizeTriggers(categorizeSettings.triggers);
        }
        Object.assign(this, categorizeSettings);
    }

}
