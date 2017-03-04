// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';
dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { AllCategories, Authentication, Autocomplete, BestBets, Categorize, Find, SearchClient, Settings, OrderBy, SearchType } from '../src/SearchClient';

describe("SearchClient basics", () => {

    it("Should have imported SearchClient class defined", () => {
        expect(typeof SearchClient).toBe("function");
    });

    it("Should be able to create SearchClient instance", () => {
        let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
        expect(typeof searchClient).toBe("object");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let searchClient = new SearchClient("file://localhost:9950/RestService/v3/");
        }).toThrow();

        expect(() => {
            let searchClient = new SearchClient("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

    it("Search instance with empty settings should have autocomplete(), find(), categorize(), allCategories() and bestBets() interface", () => {
        let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");

        expect(typeof searchClient.allCategories).toBe("object");
        expect(searchClient.allCategories instanceof AllCategories).toBeTruthy();

        expect(typeof searchClient.authentication).toBe("object");
        expect(searchClient.authentication instanceof Authentication).toBeTruthy();

        expect(typeof searchClient.autocomplete).toBe("object");
        expect(searchClient.autocomplete instanceof Autocomplete).toBeTruthy();

        expect(typeof searchClient.bestBets).toBe("object");
        expect(searchClient.bestBets instanceof BestBets).toBeTruthy();

        expect(typeof searchClient.categorize).toBe("object");
        expect(searchClient.categorize instanceof Categorize).toBeTruthy();

        expect(typeof searchClient.find).toBe("object");
        expect(searchClient.find instanceof Find).toBeTruthy();
    });

    it("Search instance with disabled 'services' should not have autocomplete(), find(), categorize(), allCategories() and bestBets() interface", () => {
        let searchClient = new SearchClient("http://localhost:9950/RestService/v3/", {
            allCategories: {enabled: false},
            authentication: {enabled: false},
            autocomplete: {enabled: false},
            bestBets: {enabled: false},
            categorize: {enabled: false},
            find: {enabled: false},
        } as Settings);

        expect(typeof searchClient.allCategories).not.toBe("object");
        expect(searchClient.allCategories instanceof AllCategories).toBeFalsy();

        expect(typeof searchClient.authentication).not.toBe("object");
        expect(searchClient.authentication instanceof Authentication).toBeFalsy();

        expect(typeof searchClient.autocomplete).not.toBe("object");
        expect(searchClient.autocomplete instanceof Autocomplete).toBeFalsy();

        expect(typeof searchClient.bestBets).not.toBe("object");
        expect(searchClient.bestBets instanceof BestBets).toBeFalsy();

        expect(typeof searchClient.categorize).not.toBe("object");
        expect(searchClient.categorize instanceof Categorize).toBeFalsy();

        expect(typeof searchClient.find).not.toBe("object");
        expect(searchClient.find instanceof Find).toBeFalsy();
    });

    it("Search instance with empty settings should have expected query interfaces", () => {
        //Date.now = jest.fn().mockReturnValue(new Date());
        let client = new SearchClient("http://localhost:9950/RestService/v3/");

        // authenticationToken
        expect(client.authenticationToken).toBeUndefined();
        client.authenticationToken = "test";
        expect(client.authenticationToken).toEqual("test");

        // clientId
        expect(client.clientId).toEqual("");
        client.clientId = "test";
        expect(client.clientId).toEqual("test");

        // dateFrom/dateTo
        expect(client.dateFrom).toBeNull();
        expect(client.dateTo).toBeNull();

        let from = {M: -1};
        client.dateFrom = from;
        expect(client.dateFrom).toEqual(from);

        let to = {M: 0};
        client.dateTo = to;
        expect(client.dateTo).toEqual(to);

        // filters
        expect(client.filters).toHaveLength(0);
        client.filters = ["test1", "test2"];
        expect(client.filters).toContain("test1");
        expect(client.filters).toContain("test2");

        expect(client.filters).not.toContain("test3");
        expect(client.filters).toHaveLength(2);
        // Removing a filter that is not there should not change the list.
        client.filterRemove("test3");
        expect(client.filters).not.toContain("test3");
        expect(client.filters).toHaveLength(2);

        client.filterAdd("test3");
        expect(client.filters).toContain("test3");
        expect(client.filters).toHaveLength(3);
        // Add same filter again should not duplicate it.
        client.filterAdd("test3");
        expect(client.filters).toContain("test3");
        expect(client.filters).toHaveLength(3);
        client.filterRemove("test3");
        expect(client.filters).not.toContain("test3");
        client.filterRemove("test2");
        expect(client.filters).not.toContain("test2");
        client.filterRemove("test1");
        expect(client.filters).not.toContain("test1");
        expect(client.filters).toHaveLength(0);
        // Remove same filter even when the list is empty, should not fail or change the no of items.
        client.filterRemove("test1");
        expect(client.filters).toHaveLength(0);

        // matchGrouping
        expect(client.matchGrouping).toBeFalsy();
        client.matchGrouping = true;
        expect(client.matchGrouping).toBeTruthy();
        client.matchGrouping = false;
        expect(client.matchGrouping).toBeFalsy();

        // matchPage
        expect(client.matchPage).toEqual(0);
        client.matchPage = 1;
        expect(client.matchPage).toEqual(1);
        client.matchPage = -1;
        expect(client.matchPage).toEqual(0);
        client.matchPagePrev();
        expect(client.matchPage).toEqual(0);
        client.matchPageNext();
        expect(client.matchPage).toEqual(1);
        client.matchPageNext();
        expect(client.matchPage).toEqual(2);
        client.matchPagePrev();
        expect(client.matchPage).toEqual(1);

        // matchPageSize
        expect(client.matchPageSize).toEqual(10);
        client.matchPageSize = 0;
        expect(client.matchPageSize).toEqual(1);
        client.matchPageSize = 10;
        expect(client.matchPageSize).toEqual(10);

        // matchOrderBy
        expect(client.matchOrderBy).toEqual(OrderBy.Relevance);
        client.matchOrderBy = OrderBy.Date;
        expect(client.matchOrderBy).toEqual(OrderBy.Date);

        //maxSuggestions
        expect(client.maxSuggestions).toEqual(10);
        client.maxSuggestions = 5;
        expect(client.maxSuggestions).toEqual(5);
        client.maxSuggestions = 0;
        expect(client.maxSuggestions).toEqual(0);
        client.maxSuggestions = -1;
        expect(client.maxSuggestions).toEqual(0);

        // queryText
        expect(client.queryText).toEqual("");
        client.queryText = "test";
        expect(client.queryText).toEqual("test");

        // searchType
        expect(client.searchType).toEqual(SearchType.Keywords);
        client.searchType = SearchType.Relevance;
        expect(client.searchType).toEqual(SearchType.Relevance);
    });

});

// describe("SearchClient live tests (require empty search-service to be instantiated)", () => {

//     it("Should get an Autocomplete lookup for word with 0 suggestions on empty localhost:9950, if available", () =>{
//         let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
//         return searchClient.autocomplete("test")
//         .then((suggestions: string[]) => {
//             expect(suggestions.length).toEqual(0);
//         });
//     });

//     it("Should get an Autocomplete lookup for Autocomplete options with 0 suggestions on empty localhost:9950, if available", () =>{
//         let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
//         return searchClient.autocomplete({ queryText: "test" } as AutocompleteSettings)
//         .then((suggestions: string[]) => {
//             expect(suggestions.length).toEqual(0);
//         });
//     });

//     it("Should get a Find result for queryText with 0 matches on empty localhost:9950, if available", () =>{
//         let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
//         return searchClient.find("test")
//         .then((matches: Matches) => {
//             expect(matches.searchMatches.length).toEqual(0);
//         });
//     });

//     it("Should get a Find result for Query options with 0 matches on empty localhost:9950, if available", () =>{
//         let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
//         return searchClient.find({ queryText: "test" } as QuerySettings)
//         .then((matches: Matches) => {
//             expect(matches.searchMatches.length).toEqual(0);
//         });
//     });

//     it("Should get a Categorize result for queryText with 0 categories on empty localhost:9950, if available", () =>{
//         let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
//         return searchClient.categorize("test")
//         .then((categories: Categories) => {
//             expect(categories.matchCount).toEqual(0);
//         });
//     });

//     it("Should get a Categorize result for Query with 0 categories on empty localhost:9950, if available", () =>{
//         let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
//         return searchClient.categorize({ queryText: "test"} as QuerySettings)
//         .then((categories: Categories) => {
//             expect(categories.matchCount).toEqual(0);
//         });
//     });

//     it("Should get a AllCategories result with 0 categories on empty localhost:9950, if available", () =>{
//         let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
//         return searchClient.allCategories()
//         .then((categories: Categories) => {
//             expect(categories.matchCount).toEqual(0);
//         });
//     });

//     it("Should get a BestBets result with 0 best-bets on empty localhost:9950, if available", () =>{
//         let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
//         return searchClient.bestBets()
//         .then((bestBets: string[]) => {
//             expect(bestBets.length).toEqual(0);
//         });
//     });
// });
