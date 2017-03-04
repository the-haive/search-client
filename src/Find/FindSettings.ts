import { Setting } from '../Common/Setting';
import { Matches } from '../Data/Matches';

import { FindTrigger } from './FindTrigger';

/**
 * These are all the settings that can affect the returned categories for Find() lookups.
 */
export class FindSettings extends Setting {

    /**
     * The endpoint to do Find lookups for.
     */
    public url: string = '/search/find';

    /**
     * The method that Find results are sent to.
     */
    public callback: (matches: Matches) => void;

    /**
     * The trigger-settings for when automatic match result-updates are to be triggered.
     */
    public trigger: FindTrigger;
}
