import * as deepmerge from 'deepmerge';

import { Query } from '../Common/Query';
import { AuthenticationSettings } from '../Authentication/AuthenticationSettings';
import { AllCategoriesSettings } from '../AllCategories/AllCategoriesSettings'
import { AutocompleteSettings } from '../Autocomplete/AutocompleteSettings';
import { BestBetsSettings } from '../BestBets/BestBetsSettings';
import { CategorizeSettings } from '../Categorize/CategorizeSettings';
import { FindSettings } from '../Find/FindSettings';

/**
 * Settings as used by the SearchClient.
 */
export class Settings {

    /**
     * Creates a Settings object for you, based on Settings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default Settings.
     */
    public static new(settings?: Settings) {
        return deepmerge(new Settings(), settings || {}, {clone: true}) as Settings;
    }

    /**
     * Settings for allCategories().
     */
    public allCategories: AllCategoriesSettings = new AllCategoriesSettings();

    /** 
     * The JWT authentication token to use. 
     */
    public authentication: AuthenticationSettings = new AuthenticationSettings();

    /**
     * Settings for autocomplete().
     */
    public autocomplete: AutocompleteSettings = new AutocompleteSettings();

    /**
     * Settings for bestBets().
     */
    public bestBets: BestBetsSettings = new BestBetsSettings();

    /**
     * Settings for categorize().
     */
    public categorize: CategorizeSettings = new CategorizeSettings();

    /**
     * Settings for find().
     */
    public find: FindSettings = new FindSettings();

    /**
     * Settings for the common query (autocomplete/find/categorize)
     */
    public query: Query = new Query();
}
