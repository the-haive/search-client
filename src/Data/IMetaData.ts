/**
 * Defines the interface for metadata.
 */
export interface IMetaData {
    /**
     * Sequential running number per metaList
     */
    $id?: number;
    /**
     * The metadata name.
     */
    key: string;
    /**
     * The metadata value.
     */
    value: string;
}
