import Query from './Query'
import Matches from './Matches'
import Categories from './Categories'
import Suggestions from './Suggestions'

export default class Settings{
    // @param {string} settings.baseServiceUrl - The service URL for the REST API
    baseServiceUrl: string;
    // @param {string} settings.findUrl - The service URL for the REST API
    findUrl: string;
    // @param {string} settings.categorizeUrl - The service URL for the REST API
    categorizeUrl:string;
    // @param {string} settings.allCategoriesUrl - The service URL for the REST API
    allCategoriesUrl: string;
    // @param {string} settings.autocompleteUrl - The service URL for the REST API
    autocompleteUrl: string;
    // @param {string} settings.bestBetsUrl - The service URL for the REST API
    bestBetsUrl: string;
    // @param {string} [settings.authenticationUrl] - The authentication URL if using JWT authentication
    authenticationUrl?: URL;
    // @param {Object} [settings.queryOptions] - Default options for queries
    query?: Query
    // @param {Function} [settings.findResultHandler] - A custom function for handling find results
    findResultHandler?: (matches: Matches) => {};
    // @param {Function} [settings.categorizeResultHandler] - A custom function for handling categorize results
    categorizeResultHandler?: (categories: Categories) => {};
    // @param {Function} [settings.autocompleteResultHandler] - A custom function for handling autocomplete results
    autocompleteResultHandler?: (suggestions: Suggestions) => {};
    allCategoriesResultHandler?: (categories: Categories) => {};
    bestBetsResultHandler?: (bestbets: any[]) => {};
    // // @param {Object} [settings.searchField] - A DOM Object representing the search field
    // searchField?: HTMLInputElement;
    // // @param {Object} [settings.searchFieldOptions] - Options for the search field, requires settings.searchField to be set
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
}