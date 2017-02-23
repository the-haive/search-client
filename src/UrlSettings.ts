/**
 * Contains url-settings for the various search endpoints.
 */
export interface UrlSettings {
    /**
     * The endpoint url for the find REST API
     */
    find?: string;

    /**
     * The endpoint url for the categorize REST API
     */
    categorize?: string;

    /**
     * The endpoint url for the autocomplete REST API
     */    
    autocomplete?: string;

    /**
     * The endpoint url for the allCategories REST API
     */
    allCategories?: string;
    
    /**
     * The endpoint url for the bestBets REST API
     */
    bestBets?: string;
};
