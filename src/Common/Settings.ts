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

    // /**
    //  * Creates an instance of Settings.
    //  */
    // constructor(settings?: Settings) {
    //     settings = settings || {} as Settings;
    //     this.allCategories = settings.allCategories || new AllCategoriesSettings();
    //     this.authentication = settings.authentication || new AuthenticationSettings();
    //     this.autocomplete = settings.autocomplete || new AutocompleteSettings();
    //     this.bestBets = settings.bestBets || new BestBetsSettings();
    //     this.categorize = settings.categorize || new CategorizeSettings();
    //     this.find = settings.find || new FindSettings();
    //     this.query = settings.query || new Query();
    // }
}
