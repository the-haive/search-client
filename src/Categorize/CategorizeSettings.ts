import * as deepmerge from 'deepmerge';

import { Setting } from '../Common/Setting';
import { Categories } from '../Data/Categories';

import { CategorizeTrigger } from './CategorizeTrigger';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class CategorizeSettings extends Setting {

    /**
     * Creates a CategorizeSettings object for you, based on CategorizeSettings defaults and the overrides provided as a param.
     * @param categorizeSettings - The settings defined here will override the default CategorizeSettings.
     */
    public static new(categorizeSettings?: CategorizeSettings) {
        return deepmerge(new CategorizeSettings(), categorizeSettings || {}, {clone: true}) as CategorizeSettings;
    }

    /**
     * The endpoint to do categorize lookups for.
     */
    public url: string = '/search/categorize';

    /**
     * The method that categorize results are sent to.
     */
    public callback: (categories: Categories) => void = undefined;

    /**
     * The trigger-settings for when automatic category result-updates are to be triggered.
     */
    public trigger: CategorizeTrigger = new CategorizeTrigger();
}
