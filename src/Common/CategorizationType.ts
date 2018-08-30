/**
 * Defines the different categorizationtypes that can be used (modes).
 * @default All
 */
export enum CategorizationType {
    /**
     * Returns categories with hits only.
     */
    All,

    /**
     * Returns all categories (even for categories that has no hits).
     */
    DocumentHitsOnly
}
