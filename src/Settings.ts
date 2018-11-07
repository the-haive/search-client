import {
    AuthenticationSettings,
    IAuthenticationSettings
} from "./Authentication";
import { AutocompleteSettings, IAutocompleteSettings } from "./Autocomplete";
import { CategorizeSettings, ICategorizeSettings } from "./Categorize";
import { Query } from "./Common";
import { FindSettings, IFindSettings } from "./Find";

export interface ISettings {
    /**
     * The JWT authentication token to use.
     */
    authentication?: IAuthenticationSettings;

    /**
     * Settings for autocomplete().
     */
    autocomplete?: IAutocompleteSettings;

    /**
     * Settings for categorize().
     */
    categorize?: ICategorizeSettings;

    /**
     * Settings for find().
     */
    find?: IFindSettings;

    /**
     * You can use this path to override the path to the rest-service.
     * If not set, it will default to "RestService/v4".
     */
    basePath?: string;

    /**
     * Settings for the common query (autocomplete/find/categorize)
     */
    query?: Query;

    /**
     * BaseUrl for the SearchClient service (can be overriden in specific services)
     */
    baseUrl?: string;
}

/**
 * Settings as used by the SearchClient.
 *
 * Please see the data-type description for each property in question.
 */
export class Settings {
    /**
     * The JWT authentication token to use.
     */
    public authentication?: IAuthenticationSettings;

    /**
     * Settings for autocomplete().
     */
    public autocomplete?: IAutocompleteSettings;

    /**
     * Settings for categorize().
     */
    public categorize?: ICategorizeSettings;

    /**
     * Settings for find().
     */
    public find?: IFindSettings;

    /**
     * You can use this path to override the path to the rest-service.
     * Default: RestService/v4
     */
    public basePath?: string;

    /**
     * Settings for the common query (autocomplete/find/categorize)
     */
    public query?: Query;

    /**
     * BaseUrl for the SearchClient service (can be overriden in specific services)
     */
    public baseUrl?: string;

    /**
     * Creates a Settings object for you, based on Settings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default Settings.
     */
    constructor(settings: ISettings | string) {
        if (typeof settings === "string") {
            settings = { baseUrl: settings };
        }

        this.baseUrl = settings.baseUrl;

        this.basePath =
            typeof settings.basePath !== "undefined"
                ? settings.basePath
                : "RestService/v4";

        // The baseUrl is to be used by all services, unless they have a specified baseUrl themselves.
        let common = { basePath: this.basePath, baseUrl: this.baseUrl };
        if (
            settings.authentication &&
            typeof settings.authentication.basePath === "undefined"
        ) {
            settings.authentication.basePath = "";
        }

        this.authentication = new AuthenticationSettings({
            ...common,
            ...settings.authentication
        });
        this.autocomplete = new AutocompleteSettings({
            ...common,
            ...settings.autocomplete
        });
        this.categorize = new CategorizeSettings({
            ...common,
            ...settings.categorize
        });
        this.find = new FindSettings({ ...common, ...settings.find });
        this.query = new Query(settings.query);
    }
}
