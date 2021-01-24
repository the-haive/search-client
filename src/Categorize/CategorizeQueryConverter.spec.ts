import { ICategory } from "../Data";
import {
    Filter,
    OrderBy,
    Query,
    SearchType,
    CategorizationType
} from "../Common";
import { CategorizeQueryConverter } from ".";

const fixedQuery = new Query({
    clientId: "mobile",
    dateFrom: "2017-03-13 09Z",
    dateTo: "2017-03-13 09Z",
    filters: [
        new Filter(["Forfattere", "Bob"], {
            categoryName: ["Authors", "Bob"],
            displayName: "Bob",
            count: 1,
            expanded: true,
            name: "Bob"
        } as ICategory),
        new Filter(["Filtype", "Word"], {
            categoryName: ["FileTypes", "docx"],
            displayName: "Word",
            count: 1,
            expanded: true,
            name: "docx"
        } as ICategory)
    ],
    matchGrouping: true,
    matchOrderBy: OrderBy.Date,
    matchPage: 1,
    matchPageSize: 20,
    maxSuggestions: 20,
    queryText: "test",
    searchType: SearchType.Keywords,
    categorizationType: CategorizationType.All,
    matchGenerateContent: true,
    matchGenerateContentHighlights: false,
    uiLanguageCode: "en"
});

describe("QueryConverters", () => {
    it("Should match expectations for REST V4 with default query", () => {
        let qc = new CategorizeQueryConverter();
        let defaultQuery = new Query();
        const expectedFindUrl =
            "http://localhost:9950/RestService/v4/search/categorize?c=web&ct=Normal&t=Keywords";

        expect(
            qc.getUrl(
                "http://localhost:9950/RestService/v4/search/categorize",
                defaultQuery
            )
        ).toEqual(expectedFindUrl);
        expect(
            qc.getUrl(
                "http://localhost:9950/RestService/v4/search/categorize",
                defaultQuery
            )
        ).toEqual(expectedFindUrl);
    });

    it("Should match expectations for REST V4 with given query", () => {
        let qc = new CategorizeQueryConverter();
        const expectedFindUrl =
            "http://localhost:9950/RestService/v4/search/categorize?c=mobile&ct=All&df=2017-03-13T09%3A00%3A00.000Z&dt=2017-03-13T09%3A00%3A00.000Z&f=Authors%7CBob%3BFileTypes%7Cdocx&l=en&q=test&t=Keywords";

        expect(
            qc.getUrl(
                "http://localhost:9950/RestService/v4/search/categorize",
                fixedQuery
            )
        ).toEqual(expectedFindUrl);
        expect(
            qc.getUrl(
                "http://localhost:9950/RestService/v4/search/categorize",
                fixedQuery
            )
        ).toEqual(expectedFindUrl);
    });
});
