/**
 * Defines the interface for metadadata, as a hierarchical list of strings. 
 */
export interface MetaList {
    /**
     * The metadata name.
     */
    key: string;
    /**
     * The metadata value.
     */
    value: string;
}
