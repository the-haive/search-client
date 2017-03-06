import * as deepmerge from 'deepmerge';

import { Setting } from '../Common/Setting';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class AllCategoriesSettings extends Setting {

    /**
     * Creates an AllCategoriesSettings object for you, based on AllCategoriesSettings defaults and the overrides provided as a param.
     * @param allCategoriesSettings - The settings defined here will override the default AllCategoriesSettings.
     */
    public static new(allCategoriesSettings?: AllCategoriesSettings) {
        return deepmerge(new AllCategoriesSettings(), allCategoriesSettings || {}, {clone: true}) as AllCategoriesSettings;
    }

    /**
     * The endpoint to do categorize lookups for.
     */
    public url: string = '/search/allcategories';
}
