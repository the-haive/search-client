/**
 * Defines the interface for autocomplete suggestions
 * @export
 * @interface Suggestions
 */
interface Suggestions  {
    // _data: {
    //     suggestions?: any[];
    // }
    /**
     * Holds the count of number of suggestions delivered.
     * @memberOf Suggestions
     */
    count: () => number;
    /**
     * Gets the list of suggestions.
     * @memberOf Suggestions
     */
    get: () => any[];
}

export default Suggestions;