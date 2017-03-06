import * as deepmerge from 'deepmerge';

import { Setting } from '../Common/Setting';
import { Matches } from '../Data/Matches';

import { FindTrigger } from './FindTrigger';

/**
 * These are all the settings that can affect the returned categories for Find() lookups.
 */
export class FindSettings extends Setting {

    /**
     * Creates a FindSettings object for you, based on FindSettings defaults and the overrides provided as a param.
     * @param findSettings - The settings defined here will override the default FindSettings.
     */
    public static new(findSettings?: FindSettings) {
        return deepmerge(new FindSettings(), findSettings || {}, {clone: true}) as FindSettings;
    }

    /**
     * The endpoint to do Find lookups for.
     */
    public url: string = '/search/find';

    /**
     * The method that Find results are sent to.
     */
    public callback: (matches: Matches) => void = undefined;

    /**
     * The trigger-settings for when automatic match result-updates are to be triggered.
     */
    public trigger: FindTrigger = new FindTrigger();
}
