import { Category } from "../Data";
import { Filter, OrderBy, Query, SearchType } from "../Common";
import { AutocompleteQueryConverter } from ".";

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
        } as Category),
        new Filter(["Filtype", "Word"], {
            categoryName: ["FileTypes", "docx"],
            displayName: "Word",
            count: 1,
            expanded: true,
            name: "docx"
        } as Category)
    ],
    matchGrouping: true,
    matchOrderBy: OrderBy.Date,
    matchPage: 1,
    matchPageSize: 20,
    maxSuggestions: 20,
    queryText: "test",
    searchType: SearchType.Keywords
});

describe("QueryConverters", () => {
    it("Should match expectations for REST V4 with default query", () => {
        let qc = new AutocompleteQueryConverter();
        let defaultQuery = new Query();
        const expectedFindUrl =
            "http://localhost:9950/RestService/v4/autocomplete?l=1&s=10";

        expect(
            qc.getUrl(
                "http://localhost:9950/RestService/v4/autocomplete",
                defaultQuery
            )
        ).toEqual(expectedFindUrl);
    });

    it("Should match expectations for REST V4 with given query", () => {
        let qc = new AutocompleteQueryConverter();
        const expectedFindUrl =
            "http://localhost:9950/RestService/v4/autocomplete?l=1&q=test&s=20";

        expect(
            qc.getUrl(
                "http://localhost:9950/RestService/v4/autocomplete",
                fixedQuery
            )
        ).toEqual(expectedFindUrl);
        expect(
            qc.getUrl(
                "http://localhost:9950/RestService/v4/autocomplete",
                fixedQuery
            )
        ).toEqual(expectedFindUrl);
    });
});
