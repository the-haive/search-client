import { AutocompleteSettings } from './AutocompleteSettings';
import { QuerySettings } from './QuerySettings';
import { Matches } from './Matches';
import { Categories } from './Categories';

/**
 * Settings as used by the SearchClient.
 */
export class Settings {
    /** 
     * The JWT authentication token to use. 
     */
    public authenticationToken?: string;

    /**
     * The default autocomplete settings to be used for autocomplete() lookups.
     */
    public autocomplete?: AutocompleteSettings;

    /**
     * The default query-settings to be used for find() and categorize() calls. 
     */
    public query?: QuerySettings;

    /**
     * Options for overriding the url for the various search endpoints.
     * 
     * @type {{
     *         // The endpoint url for the find REST API
     *         find?: string,
     *         // The endpoint url for the categorize REST API
     *         categorize?: string,
     *         // The endpoint url for the autocomplete REST API
     *         autocomplete?: string,
     *         // The endpoint url for the allCategories REST API
     *         allCategories?: string,
     *         // The endpoint url for the bestBets REST API
     *         bestBets?: string
     *     }}
     */
    public url?: {
        find?: string,
        categorize?: string,
        autocomplete?: string,
        allCategories?: string,
        bestBets?: string
    };

    /**
     * Creates an instance of Settings.
     * 
     * @param {Settings} [settings={ callback: {}, url: {}}]
     */
    constructor(settings?: Settings) {
        settings = settings || {};
        this.autocomplete = settings.autocomplete !== undefined ? settings.autocomplete : {};
        this.query        = settings.query        !== undefined ? settings.query        : {};
        this.url          = settings.url          !== undefined ? settings.url          : {};
    }
}
