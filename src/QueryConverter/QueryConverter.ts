import { OrderBy, SearchType, Query } from '../Common';

/**
 * Defines the interface for the classes that need to use a QueryConverter to create the fill urls.
 */
export interface QueryConverter {
    /**
     * Helps convert the baseUrl, servicePath and the query to a proper full url.
     * 
     * @param baseUrl The beginning part of the url that is to be used for the lookup. Typically the server, port and the base-path.
     * @param searvicePath The last part that differentiates different services within the same server.
     * @param query The query that is to be converted to be part of the url.  
     * 
     * @returns a string representing the full url for the query to be looked up on hte server
     */
    getUrl(baseUrl: string, servicePath: string, query: Query): string;
}
