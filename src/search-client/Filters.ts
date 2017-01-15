interface Filters {
    _data: {};
    /**
     * Adds a filter to the current query-expression.
     * @memberOf Filters
     */
    add: (name: string) => void;
    /**
     * Removes a filter from the current query-expression.
     * @memberOf Filters
     */
    remove: (name: string) => void;
    /**
     * Clears (empties) the list of filters. 
     * @memberOf Filters
     */
    empty: () => void;
    /**
     * Outputs the list of filters as a string.
     * @memberOf Filters
     */
    toString: () => string;
}

export default Filters;