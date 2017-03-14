import * as moment from 'moment/moment';

import { OrderBy, SearchType, Query } from '../Common';

import { QueryConverter } from './';


export class QueryCategorizeConverterV3 implements QueryConverter {
 
    /**
     * Returns the url for version 3 of the REST API.
     * 
     * @param baseUrl is the leading part of the url that is to be generated.
     * @param queyr is the query that is to be converted into the url.
     */
    public getUrl(baseUrl: string, query: Query): string {
        let params = this.getUrlParams(query).sort();
        baseUrl = baseUrl.replace(/\/+$/, "");
        return `${baseUrl}?${params.join('&')}`;
    }

    /**
     * Converts the query params to an array of key=value segments,
     * fit for Categorize V3.
     */
    protected getUrlParams(query: Query): string[] {

        let params = [];

        if (query.queryText) {
            params.push(`q=${encodeURIComponent(query.queryText)}`);
        }

        if (query.searchType != null) {
            params.push(`t=${encodeURIComponent(SearchType[query.searchType])}`);
        }

        if (query.filters.length > 0) {
            params.push(`f=${encodeURIComponent(query.filters.join(';'))}`);
        }

        if (query.clientId) {
            params.push(`c=${encodeURIComponent(query.clientId)}`);
        }

        if (query.dateFrom && query.dateTo) {
            params.push(`df=${encodeURIComponent(this.createDate(query.dateFrom))}`);
            params.push(`dt=${encodeURIComponent(this.createDate(query.dateTo))}`);
        }

        return params;
    }

     private createDate(date: Date | string | number | moment.DurationInputObject): string {
        let dateString: string;
        if (typeof date === "object" && !(date instanceof String) && !(date instanceof Date)) {
            dateString = moment().add(date).toISOString();
        } else {
            dateString = moment(date).toISOString();
        }
        return dateString;
    }

}
