import { SearchSettings } from '../Common/SearchSettings';
import { Categories } from '../Data/Categories';

import { CategorizeTrigger } from './CategorizeTrigger';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class CategorizeSettings extends SearchSettings<Categories> {

    /**
     * The trigger-settings for when automatic category result-updates are to be triggered.
     */
    public trigger: CategorizeTrigger = new CategorizeTrigger();

    /**
     * The endpoint to do categorize lookups for.
     */
    public url: string = '/search/categorize';

    /**
     * Creates a CategorizeSettings object for you, based on CategorizeSettings defaults and the overrides provided as a param.
     * @param categorizeSettings - The settings defined here will override the default CategorizeSettings.
     */
    constructor(categorizeSettings?: CategorizeSettings) {
        super(categorizeSettings);
        if (categorizeSettings) {
            categorizeSettings.trigger = new CategorizeTrigger(categorizeSettings.trigger);
        }
        Object.assign(this, categorizeSettings);
    }

}
