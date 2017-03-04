import { Setting } from '../Common/Setting';
import { Categories } from '../Data/Categories';

import { CategorizeTrigger } from './CategorizeTrigger';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class CategorizeSettings extends Setting {

    /**
     * The endpoint to do categorize lookups for.
     */
    public url: string = '/search/categorize';

    /**
     * The method that categorize results are sent to.
     */
    public callback: (categories: Categories) => void = null;

    /**
     * The trigger-settings for when automatic category result-updates are to be triggered.
     */
    public trigger: CategorizeTrigger = new CategorizeTrigger();
}
