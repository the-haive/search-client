import { BaseSettings, IBaseSettings } from '../Common'
import { QueryChangeSpecifications } from '../Common/QueryChangeSpecifications'
import { AutocompleteTriggers } from './AutocompleteTriggers'

export interface IAutocompleteSettings extends IBaseSettings<string[]> {
    /**
     * The trigger-settings for when automatic match result-updates are to be triggered.
     */
    triggers?: AutocompleteTriggers
}
/**
 * These are all the settings that can affect the returned suggestions for autocomplete() lookups.
 */
export class AutocompleteSettings extends BaseSettings<string[]> {
    /**
     * The trigger-settings for when automatic suggestion updates are to be triggered.
     */
    public triggers: AutocompleteTriggers

    /**
     * Creates an AutocompleteSettings object for you, based on AutocompleteSettings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default AutocompleteSettings.
     */
    constructor(settings: IAutocompleteSettings | string) {
        super() // dummy (using init instead)
        // Setup settings object before calling super.init with it.
        if (typeof settings === 'string') {
            settings = { baseUrl: settings } as IAutocompleteSettings
        }
        settings.servicePath =
            typeof settings.servicePath !== 'undefined'
                ? settings.servicePath
                : 'autocomplete'
        super.init(settings)

        // Setup our own stuff (props not in the base class).
        this.triggers = new AutocompleteTriggers(settings.triggers)

        // A change in any of the defined fields should indicate that the results may have changed.
        this.queryChangeSpecs =
            typeof settings.queryChangeSpecs !== 'undefined'
                ? settings.queryChangeSpecs
                : QueryChangeSpecifications.maxSuggestions |
                  QueryChangeSpecifications.queryText
    }
}
