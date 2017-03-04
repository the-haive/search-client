import { Setting } from '../Common/Setting';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class BestBetsSettings extends Setting {

    /**
     * The endpoint to do categorize lookups for.
     */
    public url: string = '/manage/bestbets';

}


