import { Query } from './Query';
import { Matches } from './Matches';
import { Categories } from './Categories';

/**
 * Settings as used by the SearchClient.
 */
export class Settings {
    /** The JWT authentication token to use. */
    //public authenticationToken?: string;

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
     * 
     */
    public url?: {
        find?: string,
        categorize?: string,
        autocomplete?: string,
        allCategories?: string,
        bestBets?: string
    };

    /**
     * Options for callbacks on the various search-operations.
     * 
     * @type {{
     *         // A callback function for handling find results
     *         find?: (matches: Matches) => any;
     *         // A callback function for handling categorize results
     *         categorize?: (categories: Categories) => any;
     *         // A callback function for handling autocomplete results
     *         autocomplete?: (suggestions: string[]) => any;        
     *         // A callback function for handling allCategories results
     *         allCategories?: (categories: Categories) => any;
     *         // A callback function for handling bestBets results
     *         bestBets?: (bestbets: any[]) => any;
     *     }}
     */
    public callback?: {
        find?: (matches: Matches) => any;
        categorize?: (categories: Categories) => any;
        autocomplete?: (suggestions: string[]) => any;        
        allCategories?: (categories: Categories) => any;
        bestBets?: (bestbets: any[]) => any;
    };

    // // @param {Object} [settings.searchField] - A DOM Object representing the search field
    // searchField?: HTMLInputElement;
    // // @param {Object} [settings.searchFieldOptions] - Options for the search field, 
    // //   requires settings.searchField to be set
    // searchFieldOptions?: {
    //     // @param {Object} [settings.searchFieldOptions.execute] - Execute options
    //     execute?: {
    //         // @param {Object} [settings.searchFieldOptions.execute.findAndCategorize] - Execute options for find and categorize
    //         findAndCategorize?: {
    //             // @param {boolean} [settings.searchFieldOptions.execute.findAndCategorize.onEnter] - Execute on enter
    //             onEnter?: boolean;
    //             // @param {boolean} [settings.searchFieldOptions.execute.findAndCategorize.onWhitespace] - Execute on whitespace
    //             onWhitespace?: boolean;
    //             // @param {boolean} [settings.searchFieldOptions.execute.findAndCategorize.onWordCharacter] - Execute on word character
    //             onWordCharacter?: boolean;
    //         }
    //         // @param {Object} [settings.searchFieldOptions.execute.autocomplete] - Execute options for autocomplete
    //         autocomplete?: {
    //             // @param {number} [settings.searchFieldOptions.execute.autocomplete.minLength] - Minimum string length to use before autocomplete will execute
    //             minLength?: number;
    //             // @param {number} [settings.searchFieldOptions.execute.autocomplete.maxResults] - Maximum results for autocomplete to return
    //             maxResults?: number;
    //         }
    //     }
    // }

    /**
     * Creates an instance of Settings.
     * 
     * @param {Settings} [settings={ callback: {}, url: {}}]
     */
    constructor(settings: Settings = { callback: {}, url: {}}) {
        settings = settings || {};
        this.url = settings.url || {};
        this.callback = settings.callback || {};
    }
}
