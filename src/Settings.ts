import { Query } from './Common/Query';
import { AuthenticationSettings } from './Authentication/AuthenticationSettings';
import { AutocompleteSettings } from './Autocomplete/AutocompleteSettings';
import { CategorizeSettings } from './Categorize/CategorizeSettings';
import { FindSettings } from './Find/FindSettings';

/**
 * Settings as used by the SearchClient.
 *
 * Please see the data-type description for each property in question.
 */
export class Settings {

    /**
     * The JWT authentication token to use.
     */
    public authentication?: AuthenticationSettings = new AuthenticationSettings();

    /**
     * Settings for autocomplete().
     */
    public autocomplete?: AutocompleteSettings = new AutocompleteSettings();

    /**
     * Settings for categorize().
     */
    public categorize?: CategorizeSettings = new CategorizeSettings();

    /**
     * Settings for find().
     */
    public find?: FindSettings = new FindSettings();

    /**
     * You can use this path to override the path to the rest-service.
     * If not set, it will default to "RestService/v4".
     */
    public path?: string = 'RestService/v4';

    /**
     * Settings for the common query (autocomplete/find/categorize)
     */
    public query?: Query = new Query();

    /**
     * Creates a Settings object for you, based on Settings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default Settings.
     */
    constructor(settings?: Settings) {

        if (settings) {
            const defaultVersionPath = { path: settings.path };
            settings.authentication = new AuthenticationSettings(settings.authentication || defaultVersionPath as AuthenticationSettings);
            settings.autocomplete = new AutocompleteSettings(settings.autocomplete || defaultVersionPath as AutocompleteSettings);
            settings.categorize = new CategorizeSettings(settings.categorize || defaultVersionPath as CategorizeSettings);
            settings.find = new FindSettings(settings.find || defaultVersionPath as FindSettings);
            settings.query = new Query(settings.query);
        }

        Object.assign(this, settings);
    }

}
