import { Group } from './Group';

/**
 * Represents categories returned from the search-engine, as delivered from the categorize() and allCategories() calls.
 */
export interface Categories {
    /**
     * Always only 1
     */
     $id?: number;

    /**
     * A list of top-level groups.
     */
    groups: Group[];
    /**
     * Indicates whether the matchCount value is estimated or exact.
     */
    isEstimatedCount: boolean;
    /**
     * The number of matches in total for the returned categories.
     */
    matchCount: number;
    extendedProperties: any [];
    statusCode: number;
    errorMessage: string;
  }
