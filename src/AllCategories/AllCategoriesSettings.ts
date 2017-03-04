import { Setting } from '../Common/Setting';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class AllCategoriesSettings extends Setting {

    /**
     * The endpoint to do categorize lookups for.
     */
    public url: string = '/search/allcategories';
}
