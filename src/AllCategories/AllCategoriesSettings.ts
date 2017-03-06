import { Setting } from '../Common/Setting';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class AllCategoriesSettings extends Setting {

    /**
     * The endpoint to do categorize lookups for.
     */
    public url: string = '/search/allcategories';

    /**
     * Creates an AllCategoriesSettings object for you, based on AllCategoriesSettings defaults and the overrides provided as a param.
     * @param allCategoriesSettings - The settings defined here will override the default AllCategoriesSettings.
     */
    constructor(allCategoriesSettings?: AllCategoriesSettings) {
        super();
        Object.assign(this, allCategoriesSettings);
    }

}
