/**
 * Ordering algorithm options. Allowed values: "Date", "Relevance"
 * @default "Relevance"
 */
export enum OrderBy {

    /**
     * Order results by Relevance, highest first.
     */
    Relevance = 0,

    /**
     * Order results by date, newest first.
     */
    Date,
}
