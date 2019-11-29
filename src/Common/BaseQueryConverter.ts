import moment from "moment";

import { IQuery } from ".";

export abstract class BaseQueryConverter {
    /**
     * Returns the url for the REST API.
     *
     * @param baseUrl is the leading part of the url that is to be generated.
     * @param query is the query that is to be converted into the url.
     * @returns The url to use for fetching the date, represented as a string.
     */
    public getUrl(url: string, query: IQuery): string {
        let params = this.getUrlParams(query).sort();
        return `${url}?${params.join("&")}`;
    }

    /**
     * Converts the query params to an array of key=value segments.
     */
    protected abstract getUrlParams(query: IQuery): string[];

    protected addParamIfSet(params: string[], key: string, param: any) {
        let value = param.toString();
        if (value) {
            params.push(`${key}=${encodeURIComponent(value)}`);
        }
    }

    protected createDate(
        date: Date | string | number | moment.DurationInputObject
    ): string {
        if (!date) {
            return "";
        }

        let dateString: string;
        if (
            typeof date === "object" &&
            !(date instanceof String) &&
            !(date instanceof Date)
        ) {
            dateString = moment()
                .add(date)
                .toISOString();
        } else {
            dateString = moment(date).toISOString();
        }
        return dateString;
    }
}
