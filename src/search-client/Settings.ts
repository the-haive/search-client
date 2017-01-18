import Query from './Query'
import Matches from './Matches'
import Categories from './Categories'
import Suggestions from './Suggestions'

/**
 * Settings as used by the SearchClient.
 */
export default class Settings{
    /** The JWT authentication token to use. */
    authenticationToken?: string;

    /** Default options for queries. */
    query?: Query

    /** Settings for find operations */
    find?: {
        /** The endpoint url for the find REST API. */
        url?: string;

        /** A custom function for handling find results. */
        handler?: (matches: Matches) => {};
    }
    categorize?: {
        /** The endpoint url for the categorize REST API. */
        url?: string;
        /** A custom function for handling categorize results. */
        handler?: (categories: Categories) => {};
    }
    autocomplete?: {
        /** The endpoint url for the autocomplete REST API. */
        url?: string;
        /** A custom function for handling autocomplete results. */
        handler?: (suggestions: Suggestions) => {};        
    }
    allCategories?: {
        /** The endpoint url for the allCategories REST API. */
        url?: string;
        /** A custom function for handling allCategories results. */
        handler?: (categories: Categories) => {};
    }

    bestBets?: {
        /** The endpoint url for the bestBets REST API. */
        url?: string;
        /** A custom function for handling bestBets results. */
        handler?: (bestbets: any[]) => {};
    }

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

    constructor(){
        this.allCategories = this.allCategories || {};
        this.autocomplete = this.autocomplete || {};
        this.bestBets = this.bestBets || {};
        this.categorize = this.categorize || {};
        this.find = this.find || {};
    }
}