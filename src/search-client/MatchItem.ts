import MetaList from './MetaList';

/**
 * Defines the interface for a match-item.
 * @export
 * @interface MatchItem
 */
export interface MatchItem {
    /**
     * This is the abstract defined in the index for the indexed item, if any.
     * @type {string}
     * @memberOf MatchItem
     */
    abstract: string;
    /**
     * This is the date the item was last modified, according to the indexing solution.
     * @type {string}
     * @memberOf MatchItem
     */
    date: string;
    /**
     * This is the list of extracts that show where some representative hits occured in the match-item. 
     * @type {string[]}
     * @memberOf MatchItem
     */
    extracts: string[];
    /**
     * This is the instanceId that the match-item was indexed as, if any.
     * 
     * @type {number}
     * @memberOf MatchItem
     */
    instanceId: number;
    /**
     * The internalId represents the internal running id for this item in the index. 
     * @type {number}
     * @memberOf MatchItem
     */
    internalId: number;
    /**
     * If the match-item is included because the search-query actually matched then this is true.
     * When grouping is on, some hits can be inserted as a parent-context to the real hit. In these scenarios this value is false.  
     * @type {boolean}
     * @memberOf MatchItem
     */
    isTrueMatch: boolean;
    /**
     * Represents the internal unique id for the item, given it's content and state. 
     * @type {string}
     * @memberOf MatchItem
     */
    itemId: string;
    // Any metadata for the item.
    metaList: MetaList[];
    /**
     * A reference to the item's parent id, if any. 
     * @type {number}
     * @memberOf MatchItem
     */
    parentInternalId: number;
    /**
     * A reference to how many levels of parents this item has.
     * @type {number}
     * @memberOf MatchItem
     */
    parentLevel: number;
    /**
     * The calculated relevance for the item. 
     * @type {number}
     * @memberOf MatchItem
     */
    relevance: number;
    /**
     * The name of the source for the item, if any
     * @type {string}
     * @memberOf MatchItem
     */
    sourceName: string;
    /**
     * The title of the item, if any.
     * @type {string}
     * @memberOf MatchItem
     */
    title: string;
    /**
     * The url for the item, if any. UIs normally use this to create direct links to the item in the application which is associated with it.
     * @type {string}
     * @memberOf MatchItem
     */
    url: string;
}


export default MatchItem;