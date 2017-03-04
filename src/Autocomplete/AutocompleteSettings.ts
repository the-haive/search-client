import { Setting } from '../Common/Setting';

import { AutocompleteTrigger } from './AutocompleteTrigger';

/**
 * These are all the settings that can affect the returned suggestions for autocomplete() lookups.
 */
export class AutocompleteSettings extends Setting {

    /**
     * The method that autocomplete results are sent to.
     */
    public callback: (suggestions: string[]) => void = null;

    /**
     * Suggests filters based on the categories in the search-engine.
     * Note: Depends on the AllCategories REST-call being enabled in the Search-Service configuration.
     * NB: Not implemented yet!
     */
    public suggestIndexFilters: boolean = false;

    /**
     * Suggests phrases based on the current phrase from the search-index.
     */
    public suggestIndexPhrases: boolean = true;

    /**
     * Suggests word-completion to complete the last word based on words in the search-engine.
     * NB Not implemented yet.
     */
    public suggestIndexWords: boolean = false;

    /**
     * Suggests word-completion for specific "command-words" in the query, such as :intelli*.
     * NB: Not implemented yet!
     */
    public suggestQueryCommandWords: boolean = false;

    /**
     * The trigger-settings for when automatic suggestion updates are to be triggered.
     */
    public trigger: AutocompleteTrigger = new AutocompleteTrigger();

    /**
     * The endpoint to do autocomplete lookups for.
     */
    public url: string = '/autocomplete';
}
