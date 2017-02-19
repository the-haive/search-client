import {Matches} from './Matches';

/**
 * The signature to be used for your monitor autocomplete-callback
 */
export declare type AutocompleteCallbackHandler = (suggestions: string[]) => any; 

/**
 * The signature to be used for your monitor find-callback
 */
export declare type FindCallbackHandler = (matches: Matches) => any;

/**
 * The signature to be used for your monitor categorize-callback
 */
export declare type CategorizeCallbackHandler = (matches: Matches) => any;

/**
 * Represents the setup of callback-handlers for each operation (autocomplete, find, categorize) for the monitored query-field.
 */
export class CallbackHandlers { 
    /**
     * The callback handler that is to receive the results from autocomplete() calls.
     */
    public autocomplete: AutocompleteCallbackHandler;

    /**
     * The callback handler that is to receive the results from find() calls.
     */
    public find: FindCallbackHandler;
    
    /**
     * The callback handler that is to receive the results from categorize() calls.
     */
    public categorize: CategorizeCallbackHandler;
}
