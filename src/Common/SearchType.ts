/**
 * Defines the different searchtypes that can be used (modes). 
 * @default Keywords
 */
export enum SearchType {
    
    /**
     * Find results via keywords mode (AND-search)
     */
    Keywords,

    /**
     * Find results via relevance-mode (OR-search)
     */
    Relevance,
}
