import { BaseSettings, IBaseSettings } from '../Common'
import {
    CategoryPresentation,
    ICategoryPresentationMap,
} from '../Common/CategoryPresentation'
import { QueryChangeSpecifications } from '../Common/QueryChangeSpecifications'
import { ICategories } from '../Data'
import { CategorizeTriggers } from './CategorizeTriggers'

export interface ICategorizeSettings extends IBaseSettings<ICategories> {
    /**
     * This is the separator-character that is used when comparing the clientCategoryFilter. You need to use this
     * to join categoryName arrays in the filter section. See [[SearchClient.clientCategoryFilter]].
     */
    clientCategoryFilterSepChar?: string

    /**
     * The trigger-settings for when automatic category-updates are to be triggered.
     */
    triggers?: CategorizeTriggers

    /**
     * Settings that dictate the presentation of the categories.
     */
    presentations?: ICategoryPresentationMap
}

/**
 * These are all the settings that can affect the returned categories for categorize() lookups.
 */
export class CategorizeSettings extends BaseSettings<ICategories> {
    /**
     * This is the separator-character that is used when comparing the clientCategoryFilter. You need to use this
     * to join categoryName arrays in the filter section. See [[SearchClient.clientCategoryFilter]].
     */
    // public clientCategoryFilterSepChar?: string;

    /**
     * The trigger-settings for when automatic category result-updates are to be triggered.
     */
    public triggers: CategorizeTriggers

    /**
     * Settings that dictate the presentation of the categories.
     */
    public presentations?: ICategoryPresentationMap

    /**
     * Creates an instance of CategorizeSettings, based on CategorizeSettings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default CategorizeSettings.
     */
    constructor(settings: ICategorizeSettings | string) {
        super() // dummy (using init instead)
        // Setup settings object before calling super.init with it.
        if (typeof settings === 'string') {
            settings = { baseUrl: settings } as ICategorizeSettings
        }
        settings.servicePath =
            typeof settings.servicePath !== 'undefined'
                ? settings.servicePath
                : 'search/categorize'
        super.init(settings)

        // Setup our own stuff (props not in the base class).
        // this.clientCategoryFilterSepChar =
        //     typeof settings.clientCategoryFilterSepChar !== "undefined"
        //         ? settings.clientCategoryFilterSepChar
        //         : "_";

        this.triggers = new CategorizeTriggers(settings.triggers)

        this.presentations = {} as ICategoryPresentationMap
        if (typeof settings.presentations !== 'undefined') {
            for (const key in settings.presentations) {
                if (settings.presentations.hasOwnProperty(key)) {
                    this.presentations[key] = new CategoryPresentation(
                        settings.presentations[key]
                    )
                }
            }
        }

        // A change in any of the defined fields should indicate that the results may have changed.
        this.queryChangeSpecs =
            typeof settings.queryChangeSpecs !== 'undefined'
                ? settings.queryChangeSpecs
                : QueryChangeSpecifications.categorizationType |
                  QueryChangeSpecifications.clientId |
                  QueryChangeSpecifications.dateFrom |
                  QueryChangeSpecifications.dateTo |
                  QueryChangeSpecifications.filters |
                  QueryChangeSpecifications.queryText |
                  QueryChangeSpecifications.searchType |
                  QueryChangeSpecifications.uiLanguageCode
    }
}
