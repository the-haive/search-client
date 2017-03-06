import { Setting } from '../Common/Setting';

import { AutocompleteTrigger } from './AutocompleteTrigger';

/**
 * These are all the settings that can affect the returned suggestions for autocomplete() lookups.
 */
export class AutocompleteSettings extends Setting {

    /**
     * A notifier method that is called just before the fetch (with isBusy = true) and as soon as the fetch is done (isBusy = false). 
     * Note: The status of the fetch (error / success) is not included in the call where isBus = false. cbSuccess and cbError will
     * be called (if defined) and thus indicate this.
     * @param isBusy - If true indicates that data is being fetched from the server. False means that the fetch is done.
     * @param url - This is the url that is/was fetched. Good for debugging purposes.
     * @param reqInit - This is the RequestInit object that was used for the fetch operation. Good for debugging purposes.
     */
    public cbBusy: (isBusy: boolean, url: string, reqInit: RequestInit) => void = undefined;

    /**
     * A notifier method to call whenever the lookup fails.
     * @param error - An error object as given by the fetch operation.
     */
    public cbError: (error: any) => void = undefined;

    /**
     * A notifier method to call whenever the lookup results have been received.
     * @param suggestions - The lookup results.
     */
    public cbSuccess: (suggestions: string[]) => void = undefined;

    /**
     * Suggests filters based on the categories in the search-engine.
     * Note: Depends on the AllCategories REST-call being enabled in the Search-Service configuration.
     * NB: Not implemented yet!
     */
    // public suggestIndexFilters: boolean = false;

    /**
     * Suggests phrases based on the current phrase from the search-index.
     */
    public suggestIndexPhrases: boolean = true;

    /**
     * Suggests word-completion to complete the last word based on words in the search-engine.
     * NB Not implemented yet.
     */
    // public suggestIndexWords: boolean = false;

    /**
     * Suggests word-completion for specific "command-words" in the query, such as :intelli*.
     * NB: Not implemented yet!
     */
    // public suggestQueryCommandWords: boolean = false;

    /**
     * The trigger-settings for when automatic suggestion updates are to be triggered.
     */
    public trigger: AutocompleteTrigger = new AutocompleteTrigger();

    /**
     * The endpoint to do autocomplete lookups for.
     */
    public url: string = '/autocomplete';

    /**
     * Creates an AutocompleteSettings object for you, based on AutocompleteSettings defaults and the overrides provided as a param.
     * @param autocompleteSettings - The settings defined here will override the default AutocompleteSettings.
     */
    constructor(autocompleteSettings?: AutocompleteSettings) {
        super();
        if (autocompleteSettings) {
            autocompleteSettings.trigger = new AutocompleteTrigger(autocompleteSettings.trigger);
        }
        Object.assign(this, autocompleteSettings);
    }

}
