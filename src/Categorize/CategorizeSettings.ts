import { Setting } from '../Common/Setting';
import { Categories } from '../Data/Categories';

import { CategorizeTrigger } from './CategorizeTrigger';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class CategorizeSettings extends Setting {

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
     * @param categories - The lookup results.
     */
    public cbSuccess: (categories: Categories) => void = undefined;

    /**
     * The trigger-settings for when automatic category result-updates are to be triggered.
     */
    public trigger: CategorizeTrigger = new CategorizeTrigger();

    /**
     * The endpoint to do categorize lookups for.
     */
    public url: string = '/search/categorize';

    /**
     * Creates a CategorizeSettings object for you, based on CategorizeSettings defaults and the overrides provided as a param.
     * @param categorizeSettings - The settings defined here will override the default CategorizeSettings.
     */
    constructor(categorizeSettings?: CategorizeSettings) {
        super();
        if (categorizeSettings) {
            categorizeSettings.trigger = new CategorizeTrigger(categorizeSettings.trigger);
        }
        Object.assign(this, categorizeSettings);
    }

}
