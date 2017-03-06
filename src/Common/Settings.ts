import { Query } from '../Common/Query';
import { AuthenticationSettings } from '../Authentication/AuthenticationSettings';
import { AllCategoriesSettings } from '../AllCategories/AllCategoriesSettings';
import { AutocompleteSettings } from '../Autocomplete/AutocompleteSettings';
import { BestBetsSettings } from '../BestBets/BestBetsSettings';
import { CategorizeSettings } from '../Categorize/CategorizeSettings';
import { FindSettings } from '../Find/FindSettings';

/**
 * Settings as used by the SearchClient.
 */
export class Settings {

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

    /**
     * Creates a Settings object for you, based on Settings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default Settings.
     */
    constructor(settings?: Settings) {
        if (settings) {
            settings.allCategories = new AllCategoriesSettings(settings.allCategories);
            settings.authentication = new AuthenticationSettings(settings.authentication);
            settings.autocomplete = new AutocompleteSettings(settings.autocomplete);
            settings.bestBets = new BestBetsSettings(settings.bestBets);
            settings.categorize = new CategorizeSettings(settings.categorize);
            settings.find = new FindSettings(settings.find);
            settings.query = new Query(settings.query);
        }
        Object.assign(this, settings);
    }

}
