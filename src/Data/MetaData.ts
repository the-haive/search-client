/**
 * Defines the interface for metadata.
 */
export interface MetaData {
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
