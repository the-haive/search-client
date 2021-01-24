/**
 * Defines the different categorization-types that can be used (modes).
 * 
 * This affects only the category-tree that is returned. The generated match-list will always have the set category-filters applied and will not be affected by this setting. 
 * 
 * Note: Hidden filters are always applied, no matter the value of this setting. 
 * 
 * @default Normal
 */
export enum CategorizationType {
    /**
     * Returns all known categories. Typically only suitable for public indexes (no permissions).
     * 
     * Server-side execution returns the full precalculated category-tree, without considering the user's permissions or hits.
     * 
     * Note: This requires a config-setting to be enabled on the server side index, as it will reveal all categories for any end-user.
     */
    All = "All",

    /**
     * Returns only categories with hits. This setting in effect reduces the number of categories each time a category-filter is added. 
     * 
     * Server-side execution does apply category-filters in the categorize() call.
     */
    Drilldown = "Drilldown",

    /**
     * Returns all categories that the user can access for the given queryText. 
     * 
     * Server-side execution does *not* apply category-filters in the categorize() call.
     */
    Normal = "Normal"
}
