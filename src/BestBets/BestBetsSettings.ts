import * as deepmerge from 'deepmerge';

import { Setting } from '../Common/Setting';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class BestBetsSettings extends Setting {

    /**
     * Creates a BestBetsSettings object for you, based on BestBetsSettings defaults and the overrides provided as a param.
     * @param bestBetsSettings - The settings defined here will override the default BestBetsSettings.
     */
    public static new(bestBetsSettings?: BestBetsSettings) {
        return deepmerge(new BestBetsSettings(), bestBetsSettings || {}, {clone: true}) as BestBetsSettings;
    }

    /**
     * The endpoint to do categorize lookups for.
     */
    public url: string = '/manage/bestbets';

}


