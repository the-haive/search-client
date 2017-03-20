import { BaseSettings } from '../Common/BaseSettings';

import { Categories } from '../Data/Categories';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class AllCategoriesSettings extends BaseSettings<Categories> {

    /**
     * The endpoint to do categorize lookups for.
     */
    public url?: string = 'search/allcategories';

    /**
     * Creates an AllCategoriesSettings object for you, based on AllCategoriesSettings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default AllCategoriesSettings.
     */
    constructor(settings?: AllCategoriesSettings) {
        super(settings);
        
        if (settings) {
            this.url = typeof settings.url !== "undefined" ? settings.url : this.url;
        }

        // Remove leading and trailing slashes from the url
        this.url = this.url.replace(/(^\/+)|(\/+$)/g, "");
    }

}
