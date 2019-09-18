import { IMetaData } from "./IMetaData";

/**
 * Defines the interface for a match-item.
 */
export interface IMatchItem {
    /**
     * Sequential running number per match-item
     */
    $id?: number;
    /**
     * This is the abstract defined in the index for the indexed item, if any.
     */
    abstract: string;
    /**
     * A list of categories that this items is tagged with.
     * Note: The list returned is according to configured rules in the IndexManager. The IndexManager may even be configured to return no categories.
     */
    categories?: string[];
    /**
     * A list of query permissions that matched the item permissions.
     */
    matchedPermissions?: string[];
    /**
     * A list of content paragraphs, that represent the full item in regards to textual content.
     * To get the content, please set the generateContent (and potentially also the generateContentHighlights) settings in the request.
     * Note: The paragraphs returned is according to configured rules in the IndexManager. The IndexManager may even be configured to return no paragraphs.
     */
    content?: string[];
    /**
     * This is the date the item was last modified, according to the indexing solution.
     */
    date: string;
    /**
     * This is the list of extracts that show where some representative hits occurred in the match-item.
     */
    extracts: string[];
    /**
     * This is the instanceId that the match-item was indexed as, if any.
     */
    instanceId: number;
    /**
     * The internalId represents the internal running id for this item in the index.
     */
    internalId: number;
    /**
     * If the match-item is included because the search-query actually matched then this is true.
     * When grouping is on, some hits can be inserted as a parent-context to the real hit. In these scenarios this value is false.
     */
    isTrueMatch: boolean;
    /**
     * Represents the internal unique id for the item, given it's content and state.
     */
    itemId: string;
    /**
     * Any metadata for the item.
     */
    metaList: IMetaData[];
    /**
     * A reference to the item's parent id, if any.
     */
    parentInternalId?: number;
    /**
     * A reference to how many levels of parents this item has.
     */
    parentLevel: number;
    /**
     * The calculated relevance for the item.
     */
    relevance: number;
    /**
     * The name of the source for the item, if any
     */
    sourceName: string;
    /**
     * The title of the item, if any.
     */
    title: string;
    /**
     * The url for the item, if any. UIs normally use this to create direct links to the item in the application which is associated with it.
     */
    url: string;
}
