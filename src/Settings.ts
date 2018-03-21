import { VersionPathSettings } from './Common/VersionPathSettings';
import { Query } from './Common/Query';
import { AuthenticationSettings } from './Authentication/AuthenticationSettings';
import { AllCategoriesSettings } from './AllCategories/AllCategoriesSettings';
import { AutocompleteSettings } from './Autocomplete/AutocompleteSettings';
import { BestBetsSettings } from './BestBets/BestBetsSettings';
import { CategorizeSettings } from './Categorize/CategorizeSettings';
import { FindSettings } from './Find/FindSettings';

/**
 * Settings as used by the SearchClient.
 * 
 * Please see the data-type description for each property in question.
 */
export class Settings extends VersionPathSettings {

    /**
     * Settings for allCategories().
     */
    public allCategories?: AllCategoriesSettings = new AllCategoriesSettings();

    /** 
     * The JWT authentication token to use. 
     */
    public authentication?: AuthenticationSettings = new AuthenticationSettings();

    /**
     * Settings for autocomplete().
     */
    public autocomplete?: AutocompleteSettings = new AutocompleteSettings();

    /**
     * Settings for bestBets().
     */
    public bestBets?: BestBetsSettings = new BestBetsSettings();

    /**
     * Settings for categorize().
     */
    public categorize?: CategorizeSettings = new CategorizeSettings();

    /**
     * Settings for find().
     */
    public find?: FindSettings = new FindSettings();

    /**
     * Settings for the common query (autocomplete/find/categorize)
     */
    public query?: Query = new Query();

    /**
     * Creates a Settings object for you, based on Settings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default Settings.
     */
    constructor(settings?: Settings) {
        super(settings);
        if (settings) {
            const defaultVersionPath = { version: settings.version, path: settings.path };
            settings.allCategories = new AllCategoriesSettings(settings.allCategories || defaultVersionPath as AllCategoriesSettings);
            settings.authentication = new AuthenticationSettings(settings.authentication || defaultVersionPath as AuthenticationSettings);
            settings.autocomplete = new AutocompleteSettings(settings.autocomplete || defaultVersionPath as AutocompleteSettings);
            settings.bestBets = new BestBetsSettings(settings.bestBets || defaultVersionPath as BestBetsSettings);
            settings.categorize = new CategorizeSettings(settings.categorize || defaultVersionPath as CategorizeSettings);
            settings.find = new FindSettings(settings.find || defaultVersionPath as FindSettings);
            settings.query = new Query(settings.query);
        } else {
            this.path += this.version;
        }
        Object.assign(this, settings);
    }

}
