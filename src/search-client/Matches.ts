import MatchItem from './MatchItem';

/**
 * Defines interface for received search-matches.  
 * @interface Matches
 */
interface Matches {
    /**
     * The list of best-bets, if any.
     * @type {any[]}
     * @memberOf Matches
     */
    bestBets: any[];
    /**
     * The list of did-you-mean spellcheck suggestions.
     * @type {any[]}
     * @memberOf Matches
     */
    didYouMeanList: any[];
    /**
     * The estimated match-count, used for when the returned count from the search-index is estimated.
     * @type {number}
     * @memberOf Matches
     */
    estimatedMatchCount: number;
    /**
     * The expanded query, as what it was actually expanded to in the search-engine internals.
     * @type {string}
     * @memberOf Matches
     */
    expandedQuery: string;
    /**
     * The number of the next page of results.
     * @type {number}
     * @memberOf Matches
     */
    nextPageRef: number;
    /**
     * The actual list of match-items.
     * 
     * @type {MatchItem[]}
     * @memberOf Matches
     */
    searchMatches: MatchItem[];
}

export default Matches;
