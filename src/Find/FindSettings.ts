import { BaseSettings } from '../Common/BaseSettings';
import { Matches } from '../Data/Matches';

import { FindTriggers } from './FindTriggers';

/**
 * These are all the settings that can affect the returned categories for Find() lookups.
 */
export class FindSettings extends BaseSettings<Matches> {

    /**
     * The trigger-settings for when automatic match result-updates are to be triggered.
     */
    public triggers?: FindTriggers = new FindTriggers();

    /**
     * The endpoint to do Find lookups for.
     */
    public url?: string = '/search/find';

    /**
     * Creates a FindSettings object for you, based on FindSettings defaults and the overrides provided as a param.
     * @param findSettings - The settings defined here will override the default FindSettings.
     */
    constructor(findSettings?: FindSettings) {
        super(findSettings);
        if (findSettings) {
            findSettings.triggers = new FindTriggers(findSettings.triggers);
        }
        Object.assign(this, findSettings);
    }

}
