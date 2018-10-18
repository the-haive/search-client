/**
 * Defines the enum bit-field flags that signifies which query-fields that may resolve in changed results (both Categorize and Find).
 */
export enum QueryChangeSpecifications {
    none = 0,
    clientId = 1 << 0,
    categorizationType = 1 << 1,
    dateFrom = 1 << 2,
    dateTo = 1 << 3,
    filters = 1 << 4,
    matchGenerateContent = 1 << 5,
    matchGenerateContentHighlights = 1 << 6,
    matchGrouping = 1 << 7,
    matchOrderBy = 1 << 8,
    matchPage = 1 << 9,
    matchPageSize = 1 << 10,
    maxSuggestions = 1 << 11,
    queryText = 1 << 12,
    searchType = 1 << 13,
    uiLanguageCode = 1 << 14
}
