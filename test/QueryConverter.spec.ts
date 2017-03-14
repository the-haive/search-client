import { OrderBy, SearchType } from '../src/Common';
// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");


import { Query, QueryConverter, QueryCategorizeConverterV2, QueryCategorizeConverterV3, QueryFindConverterV2, QueryFindConverterV3 } from '../src/SearchClient';

const query = new Query({
    clientId: "mobile", 
    dateFrom: "2017-03-13", 
    dateTo: "2017-03-13", 
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

        expect(cc2.getUrlParams(query)).toHaveLength(3);
        expect(cc2.getUrl("baseUrl", query)).toMatchSnapshot();
        expect(cc2.getUrl("baseUrl/", query)).toMatchSnapshot();

        expect(cf2.getUrlParams(query)).toHaveLength(7);
        expect(cf2.getUrl("baseUrl", query)).toMatchSnapshot();
        expect(cf2.getUrl("baseUrl/", query)).toMatchSnapshot();
    });

    it("Should match expectations for REST V3", () => {
        let cc3 = (<any> new QueryCategorizeConverterV3());
        let cf3 = (<any> new QueryFindConverterV3());

        expect(cc3.getUrlParams(query)).toHaveLength(6);
        expect(cc3.getUrl("baseUrl", query)).toMatchSnapshot();
        expect(cc3.getUrl("baseUrl/", query)).toMatchSnapshot();

        expect(cf3.getUrlParams(query)).toHaveLength(10);
        expect(cf3.getUrl("baseUrl", query)).toMatchSnapshot();
        expect(cf3.getUrl("baseUrl/", query)).toMatchSnapshot();
    });

});
