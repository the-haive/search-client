import { IMatchItem } from "./IMatchItem";

/**
 * Defines interface for received search-matches.
 */
export interface IMatches {
    /**
     * Always 1
     */
    $id?: number;
    /**
     * The list of best-bets, if any.
     */
    bestBets: any[];
    /**
     * The list of did-you-mean spellcheck suggestions.
     */
    didYouMeanList: any[];
    /**
     * The estimated match-count, used for when the returned count from the search-index is estimated.
     */
    estimatedMatchCount: number;
    /**
     * The expanded query, as what it was actually expanded to in the search-engine internals.
     */
    expandedQuery: string;
    /**
     * The number of the next page of results.
     */
    nextPageRef: number;
    /**
     * The actual list of match-items.
     */
    searchMatches: IMatchItem[];
    statusCode: number;
    errorMessage: string;
}
