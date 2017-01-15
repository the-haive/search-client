/**
 * Defines the interface for metadadata, as a hierarchical list of strings. 
 * @interface MetaList
 */
interface MetaList {
    /**
     * The metadata name.
     * @type {string}
     * @memberOf MetaList
     */
    key: string;
    /**
     * The metadata value.
     * @type {string}
     * @memberOf MetaList
     */
    value: string;
}

export default MetaList;