import moment from "moment";

import { CategorizationType } from "./CategorizationType";
import { OrderBy } from "./OrderBy";
import { SearchType } from "./SearchType";
import { Filter } from "./Filter";

/**
 * Represents a date-specification that can either be fixed or a delta from now.
 * If the date is a moment DurationInputObject we calculate the date in real-time when the fetch-call is executed.
 * Note that the value must be an object with properties and values. I.e. { M: -1 } // One month ago
 * See http://momentjs.com/docs/#/durations/.
 * Otherwise we assume that the value is a fixed value that the moment library can parse without any helping formatting
 * strings. See http://momentjs.com/docs/#/parsing/string/.
 */
export type DateSpecification =
    | Date
    | string
    | number
    | moment.DurationInputObject;

export class Query {
    /**
     * Any string that you want to identify the client with. Can be used in the categories configuration and in the relevance tuning.
     */
    public clientId?: string = "";

    /**
     * Used to specify whether categorize calls should always return all categories or just categories that has matches.
     */
    public categorizationType?: CategorizationType = CategorizationType.All;

    // /**
    //  * Controls the category expansion overrides. Used to override the expanded property for categories in the category-tree.
    //  * Set when the user clicks on the toggle for expanding/collapsing categories.
    //  */
    // public clientCategoryExpansion?: { [key: string]: boolean } = {};

    // /**
    //  * This is a handy helper to help the user navigating the category-tree. It is typically used when a given node
    //  * has a lot of categories. This often happens with i.e. the Author category node. With this feature you can
    //  * present the user with a filter-edit-box in the Author node, and allow them to start typing values which will
    //  * then filter the category-nodes' displayName to only match the text entered.
    //  *
    //  * Nodes that doesn't have any filters are returned, even if filters for other nodes are defined.
    //  *
    //  * Also note that the filter automatically sets the expanded property for affected nodes, to help allow them to
    //  * automatically be shown, with their immediate children.
    //  *
    //  * The actual value is an associative array that indicates which category-nodes to filter and what pattern to filter
    //  * that node with.
    //  *
    //  * It will not execute any server-side calls, but may run triggers leading to new content returned in callbacks.
    //  *
    //  * **Note 1:** This is only used when:
    //  *
    //  * **1. The categorize service is enabled in the [[SearchClient]] constructor (may be disabled via the [[Settings]]
    //  * object).**
    //  * **2. You have enabled a [[CategorizeSettings.cbSuccess]] callback.**
    //  * **3. You have not disabled the [[CategorizeTriggers.clientCategoryFilterChanged]] trigger.**
    //  *
    //  * **Note 2:** [[deferUpdates]] will not have any effect on this functionality. Deferring only affects calls to the
    //  * server and does not stop categorize-callbacks from being run - as long as they are the result of changing the
    //  * [[clientCategoryFilter]].
    //  *
    //  * @example How to set the clientCategoryFilter:
    //  *
    //  *      query.clientCategoryFilter = {
    //  *         // Show only Author-nodes with DisplayName that matches /john/.
    //  *         Author: /john/,
    //  *         // Show only nodes in the System/File/Server node that matches /project/
    //  *         System_File_Server: /project/,
    //  *      }
    //  * or
    //  *      query.clientCategoryFilter["Author"] = /john/
    //  *
    //  * As you can see from the example the key is composed by joining the categoryName with an underscore. If you
    //  * experience problems with this (i.e. your categories have `_` in their names already) then change the
    //  * [[CategorizeSettings.clientCategoryFilterSepChar]], for example to `|`. Note that if you do, then you probably
    //  * also need to quote the keys that have the pipe-character.
    //  *
    //  * @example The above example will with [[CategorizeSettings.clientCategoryFilterSepChar]] set to `|` become:
    //  *
    //  *     const searchClient = new SearchClient("http://server:9950/");
    //  *
    //  *     query.clientCategoryFilter = {
    //  *         // Show only Author-nodes with DisplayName that matches /john/.
    //  *         Author: /john/,
    //  *         // Show only nodes in the System/File/Server node that matches /project/
    //  *         "System|File|Server": /project/,
    //  *     }
    //  *
    //  */
    // public clientCategoryFilter?: { [key: string]: string | RegExp } = {};

    /**
     * Used to specify the start date-range.
     */
    public dateFrom?: DateSpecification = null;

    /**
     * Used to specify the end date-range.
     */
    public dateTo?: DateSpecification = null;

    /**
     * Use one of this query parameter to specify the filters to apply. Each filter should contain its group name
     * followed by category names, representing complete hierarchy of the category. The names specified here is derived from category Name
     * property and not its display name. When specifying multiple filters, separate them either by comma or semicolon.
     * For example: &f=Authors|Sam;FileTypes|docx
     * Note the above names are case sensitive.
     */
    public filters?: Filter[] = [];

    /**
     * Decides whether or not to request content to be generated in the response matches.
     */
    public matchGenerateContent?: boolean = false;

    /**
     * Decides whether or not to request highlight-tags to be included in the generated the response matches.
     *
     * Note: Requires `matchGenerateContent` to be `true` to be effective.
     */
    public matchGenerateContentHighlights?: boolean = true;

    /**
     * Decides whether or not to use the parent-grouping feature to group results.
     */
    public matchGrouping?: boolean = false;

    /**
     * Decides which ordering algorithm to use.
     */
    public matchOrderBy?: OrderBy = OrderBy.Relevance;

    /**
     * The actual page to fetch. Expects a number >= 1.
     */
    public matchPage?: number = 1;

    /**
     * The number of results per page to fetch. Expects a number >= 1.
     */
    public matchPageSize?: number = 10;

    /**
     * The maximum number of query-suggestions to fetch.
     */
    public maxSuggestions?: number = 10;

    /**
     * The queryText that is to be used for autocomplete/find/categorize.
     */
    public queryText?: string = "";

    /**
     * The type of search to perform.
     */
    public searchType?: SearchType = SearchType.Keywords;

    /**
     * The UI language of the client (translates i.e. categories to the client language).
     */
    public uiLanguageCode?: string = "";

    /**
     * Instantiates a Query object, based on Query defaults and the overrides provided as a param.
     *
     * @param query - The Query object with override values.
     */
    constructor(query: Query = {} as Query) {
        if (
            query.categorizationType &&
            CategorizationType[query.categorizationType] === undefined
        ) {
            throw new Error(
                `Illegal CategorizationType value: ${query.categorizationType}`
            );
        }
        if (query.matchOrderBy && OrderBy[query.matchOrderBy] === undefined) {
            throw new Error(`Illegal OrderBy value: ${query.matchOrderBy}`);
        }
        if (query.searchType && SearchType[query.searchType] === undefined) {
            throw new Error(`Illegal SearchType value: ${query.searchType}`);
        }
        Object.assign(this, query);
    }
}
