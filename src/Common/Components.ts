/**
 * Defines which components that are to be effected.
 * The enum is a bitwise field so you can the | and & btiwise operators. 
 */
export enum Components {
    /**
     * Affect all components (same as Autocomplete | Categorize | Find)
     */
    All = 0,

    /**
     * Affect only Autocomplete.
     */
    Autocomplete = 1,

    /**
     * Affect only Categorize.
     */
    Categorize = 2,

    /**
     * Affect only Find.
     */
    Find = 4,
}
