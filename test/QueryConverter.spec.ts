import { OrderBy, SearchType } from '../src/Common';
// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { Query, QueryConverter, QueryCategorizeConverterV2, QueryCategorizeConverterV3, QueryFindConverterV2, QueryFindConverterV3 } from '../src/SearchClient';

const query = new Query({
    clientId: "mobile", 
    dateFrom: "2017-03-13 09Z", 
    dateTo: "2017-03-13 09Z", 
    filters: ["Authors|Bob", "FileTypes|docx"], 
    matchGrouping: true, 
    matchOrderBy: OrderBy.Date, 
    matchPage: 1, 
    matchPageSize: 20, 
    maxSuggestions: 20, 
    queryText: "test", 
    searchType: SearchType.Keywords,
});

describe("QueryConverters", () => {

    it("Should have QueryConverter interface", () => {
        let cc2 = (<any> new QueryCategorizeConverterV2());
        let cc3 = (<any> new QueryCategorizeConverterV3());
        let cf2 = (<any> new QueryFindConverterV2());
        let cf3 = (<any> new QueryFindConverterV3());

        expect((cc2 as QueryConverter).getUrl).toBeDefined();
    });

    it("Should match expectations for REST V2", () => {
        let cc2 = (<any> new QueryCategorizeConverterV2());
        let cf2 = (<any> new QueryFindConverterV2());
        const expectedCatUrl = "http://localhost:9950/RestService/v2/search/categorize/test?c=mobile&f=Authors%7CBob%3BFileTypes%7Cdocx&t=Keywords";
        expect(cc2.getUrlParams(query)).toHaveLength(3);
        expect(cc2.getUrl("http://localhost:9950/RestService/v2", "search/categorize", query)).toEqual(expectedCatUrl);
        expect(cc2.getUrl("http://localhost:9950/RestService/v2/", "search/categorize", query)).toEqual(expectedCatUrl);
        expect(cc2.getUrl("http://localhost:9950/RestService/v2", "search/categorize/", query)).toEqual(expectedCatUrl);
        expect(cc2.getUrl("http://localhost:9950/RestService/v2/", "search/categorize/", query)).toEqual(expectedCatUrl);
        expect(cc2.getUrl("http://localhost:9950/RestService/v2", "/search/categorize/", query)).toEqual(expectedCatUrl);
        expect(cc2.getUrl("http://localhost:9950/RestService/v2/", "/search/categorize/", query)).toEqual(expectedCatUrl);

        const expectedFindUrl = "http://localhost:9950/RestService/v2/search/find/test?c=mobile&f=Authors%7CBob%3BFileTypes%7Cdocx&g=true&o=Date&p=1&s=20&t=Keywords";
        expect(cf2.getUrlParams(query)).toHaveLength(7);
        expect(cf2.getUrl("http://localhost:9950/RestService/v2", "search/find", query)).toEqual(expectedFindUrl);
        expect(cf2.getUrl("http://localhost:9950/RestService/v2/", "search/find", query)).toEqual(expectedFindUrl);
        expect(cf2.getUrl("http://localhost:9950/RestService/v2", "search/find/", query)).toEqual(expectedFindUrl);
        expect(cf2.getUrl("http://localhost:9950/RestService/v2/", "search/find/", query)).toEqual(expectedFindUrl);
        expect(cf2.getUrl("http://localhost:9950/RestService/v2", "/search/find/", query)).toEqual(expectedFindUrl);
        expect(cf2.getUrl("http://localhost:9950/RestService/v2/", "/search/find/", query)).toEqual(expectedFindUrl);
    });

    it("Should match expectations for REST V3", () => {
        let cc3 = (<any> new QueryCategorizeConverterV3());
        let cf3 = (<any> new QueryFindConverterV3());

        const expectedCatUrl = "http://localhost:9950/RestService/v3/search/categorize?c=mobile&df=2017-03-13T09%3A00%3A00.000Z&dt=2017-03-13T09%3A00%3A00.000Z&f=Authors%7CBob%3BFileTypes%7Cdocx&q=test&t=Keywords";
        expect(cc3.getUrlParams(query)).toHaveLength(6);
        expect(cc3.getUrl("http://localhost:9950/RestService/v3", "search/categorize", query)).toEqual(expectedCatUrl);
        expect(cc3.getUrl("http://localhost:9950/RestService/v3/", "search/categorize", query)).toEqual(expectedCatUrl);
        expect(cc3.getUrl("http://localhost:9950/RestService/v3", "search/categorize/", query)).toEqual(expectedCatUrl);
        expect(cc3.getUrl("http://localhost:9950/RestService/v3/", "search/categorize/", query)).toEqual(expectedCatUrl);
        expect(cc3.getUrl("http://localhost:9950/RestService/v3", "/search/categorize/", query)).toEqual(expectedCatUrl);
        expect(cc3.getUrl("http://localhost:9950/RestService/v3/", "/search/categorize/", query)).toEqual(expectedCatUrl);

        const expectedFindUrl = "http://localhost:9950/RestService/v3/search/find?c=mobile&df=2017-03-13T09%3A00%3A00.000Z&dt=2017-03-13T09%3A00%3A00.000Z&f=Authors%7CBob%3BFileTypes%7Cdocx&g=true&o=Date&p=1&q=test&s=20&t=Keywords";
        expect(cf3.getUrlParams(query)).toHaveLength(10);
        expect(cf3.getUrl("http://localhost:9950/RestService/v3", "search/find", query)).toEqual(expectedFindUrl);
        expect(cf3.getUrl("http://localhost:9950/RestService/v3/", "search/find", query)).toEqual(expectedFindUrl);
        expect(cf3.getUrl("http://localhost:9950/RestService/v3", "search/find/", query)).toEqual(expectedFindUrl);
        expect(cf3.getUrl("http://localhost:9950/RestService/v3/", "search/find/", query)).toEqual(expectedFindUrl);
        expect(cf3.getUrl("http://localhost:9950/RestService/v3", "/search/find/", query)).toEqual(expectedFindUrl);
        expect(cf3.getUrl("http://localhost:9950/RestService/v3/", "/search/find/", query)).toEqual(expectedFindUrl);
    });

});
