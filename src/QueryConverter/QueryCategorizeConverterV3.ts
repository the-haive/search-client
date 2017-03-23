import * as moment from 'moment/moment';

import { OrderBy, SearchType, Query } from '../Common';

import { QueryBaseConverter, QueryConverter } from './';

/**
 * Class to handle creating categorize lookups for restservice version 3.
 */
export class QueryCategorizeConverterV3 extends QueryBaseConverter implements QueryConverter {
 
    /**
     * Returns the url for version 3 of the REST API.
     * 
     * @param baseUrl is the leading part of the url that is to be generated.
     * @param queyr is the query that is to be converted into the url.
     */
    public getUrl(baseUrl: string, servicePath: string, query: Query): string {
        let params = this.getUrlParams(query).sort();
        baseUrl = baseUrl.replace(/\/+$/, "");
        servicePath = servicePath.replace(/(^\/+)|(\/+$)/g, "");
        return `${baseUrl}/${servicePath}?${params.join('&')}`;
    }

    /**
     * Converts the query params to an array of key=value segments,
     * fit for Categorize V3.
     */
    protected getUrlParams(query: Query): string[] {
        let params: string[] = [];

        this.addParamIfSet(params, 'c', query.clientId);
        this.addParamIfSet(params, 'df', this.createDate(query.dateFrom));
        this.addParamIfSet(params, 'dt', this.createDate(query.dateTo));
        this.addParamIfSet(params, 'f', query.filters.join(';'));
        this.addParamIfSet(params, 'q', query.queryText);
        this.addParamIfSet(params, 't', SearchType[query.searchType]);

        return params;
    }

    private createDate(date: Date | string | number | moment.DurationInputObject): string {
        if (!date) {
            return "";
        }

        let dateString: string;
        if (typeof date === "object" && !(date instanceof String) && !(date instanceof Date)) {
            dateString = moment().add(date).toISOString();
        } else {
            dateString = moment(date).toISOString();
        }
        return dateString;
    }

}
