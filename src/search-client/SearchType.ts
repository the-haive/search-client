/**
 * Defines the different searchtypes that can be used (modes). 
 * @export
 * @enum {number}
 */
enum SearchType{
    /**
     * Find results via keywords mode (AND-search)
     */
    Keywords,
    /**
     * Find results via relevance-mode (OR-search)
     */
    Relevance
}

export default SearchType