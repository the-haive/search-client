import { SearchSettings } from '../Common/SearchSettings';

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class BestBetsSettings extends SearchSettings<string[]> {

    /**
     * The endpoint to do categorize lookups for.
     */
    public url: string = '/manage/bestbets';

    /**
     * Creates a BestBetsSettings object for you, based on BestBetsSettings defaults and the overrides provided as a param.
     * @param bestBetsSettings - The settings defined here will override the default BestBetsSettings.
     */
    constructor(bestBetsSettings?: BestBetsSettings) {
        super(bestBetsSettings);
        Object.assign(this, bestBetsSettings);
    }

}
