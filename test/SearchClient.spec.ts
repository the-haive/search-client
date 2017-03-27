import { Category } from '../src/Data';
import { Filter } from '../src/Common';
// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';
dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { AllCategories, Authentication, Autocomplete, BestBets, Categorize, Find, SearchClient, Settings, OrderBy, SearchType, Categories, Matches, FindSettings, FindTriggers, QueryFindConverterV3 } from '../src/SearchClient';

const reference: Categories = require('./data/categories.json');

describe("SearchClient basics", () => {

    it("Should have imported SearchClient class defined", () => {
        expect(typeof SearchClient).toBe("function");
    });

    it("Should be able to create SearchClient instance", () => {
        let searchClient = new SearchClient("http://localhost:9950");
        expect(typeof searchClient).toBe("object");
        expect(searchClient.find.baseUrl).toEqual("http://localhost:9950/RestService/v3");
        
    });

    it("Should be able to ", () => {
        let searchClient = new SearchClient("http://localhost:9950");
        expect(typeof searchClient).toBe("object");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let searchClient = new SearchClient("file://localhost:9950");
        }).toThrow();

        expect(() => {
            let searchClient = new SearchClient("http:+//localhost:9950");
        }).toThrow();
    });

    it("Search instance with empty settings should have autocomplete(), find(), categorize(), allCategories() and bestBets() interface", () => {
        let searchClient = new SearchClient("http://localhost:9950");

        expect(typeof searchClient.allCategories).toBe("object");
        expect(searchClient.allCategories instanceof AllCategories).toBeTruthy();

        expect(typeof searchClient.authentication).not.toBe("object");
        expect(searchClient.authentication instanceof Authentication).toBeFalsy();

        expect(typeof searchClient.autocomplete).toBe("object");
        expect(searchClient.autocomplete instanceof Autocomplete).toBeTruthy();

        expect(typeof searchClient.bestBets).toBe("object");
        expect(searchClient.bestBets instanceof BestBets).toBeTruthy();

        expect(typeof searchClient.categorize).toBe("object");
        expect(searchClient.categorize instanceof Categorize).toBeTruthy();

        expect(typeof searchClient.find).toBe("object");
        expect(searchClient.find instanceof Find).toBeTruthy();
    });
});

describe("SearchClient settings", () => {
    it("Search instance with disabled 'services' should not have autocomplete(), find(), categorize(), allCategories() and bestBets() interface", () => {
        let searchClient = new SearchClient("http://localhost:9950", {
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
        let client = new SearchClient("http://localhost:9950");

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

    });
});

describe("SearchClient filter interface", () => {
    it("Should have working filter interfaces", () => {
        let client = new SearchClient("http://localhost:9950");
        client.categorize.categories = reference;

        // filters
        expect(client.filters).toHaveLength(0);
        const filterSystemFile = client.categorize.createCategoryFilter(["System", "File", "Testdata", "Norway"]);
        const filterAuthorLarsFrode = client.categorize.createCategoryFilter(["Author", "Lars Frode"]);
        const filterFileTypeDoc = client.categorize.createCategoryFilter(["FileType", "DOC"]);

        expect(client.filters).toHaveLength(0);
        expect(client.filters).not.toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);
        expect(client.filters).not.toContainEqual(filterSystemFile);

        client.filterAdd(filterSystemFile);
        expect(client.filters).toHaveLength(1);
        expect(client.filters).not.toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);
        expect(client.filters).toContainEqual(filterSystemFile);

        client.filters = [filterSystemFile, filterAuthorLarsFrode];
        expect(client.filters).toHaveLength(2);
        expect(client.filters).toContainEqual(filterSystemFile);
        expect(client.filters).toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);

        // Removing a filter that is not there should not change the list.
        client.filterRemove(filterFileTypeDoc);
        expect(client.filters).toHaveLength(2);
        expect(client.filters).toContainEqual(filterSystemFile);
        expect(client.filters).toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);

        client.filterAdd(filterFileTypeDoc);
        expect(client.filters).toHaveLength(3);
        expect(client.filters).toContainEqual(filterSystemFile);
        expect(client.filters).toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).toContainEqual(filterFileTypeDoc);

        client.filterRemove(filterFileTypeDoc);
        expect(client.filters).toHaveLength(2);
        expect(client.filters).toContainEqual(filterSystemFile);
        expect(client.filters).toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);

        client.filterRemove(filterSystemFile);
        expect(client.filters).toHaveLength(1);
        expect(client.filters).not.toContainEqual(filterSystemFile);
        expect(client.filters).toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);

        client.filterRemove(filterAuthorLarsFrode);
        expect(client.filters).toHaveLength(0);
        expect(client.filters).not.toContainEqual(filterSystemFile);
        expect(client.filters).not.toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);

        // Remove same filter even when the list is empty, should not fail or change the no of items.
        client.filterRemove(filterAuthorLarsFrode);
        expect(client.filters).toHaveLength(0);

        // Verify filter-toggles
        client.filterToggle(filterAuthorLarsFrode);
        expect(client.filters).toHaveLength(1);
        expect(client.filters).not.toContainEqual(filterSystemFile);
        expect(client.filters).toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);

        client.filterToggle(filterFileTypeDoc);
        expect(client.filters).toHaveLength(2);
        expect(client.filters).not.toContainEqual(filterSystemFile);
        expect(client.filters).toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).toContainEqual(filterFileTypeDoc);

        client.filterToggle(filterAuthorLarsFrode);
        expect(client.filters).toHaveLength(1);
        expect(client.filters).not.toContainEqual(filterSystemFile);
        expect(client.filters).not.toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).toContainEqual(filterFileTypeDoc);

        // Verify that writing the filters directly works
        client.filters = [filterAuthorLarsFrode, filterFileTypeDoc];
        expect(client.filters).toHaveLength(2);
        expect(client.filters).not.toContainEqual(filterSystemFile);
        expect(client.filters).toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).toContainEqual(filterFileTypeDoc);
    });

    it("Should have working match*, queryText, searchType, findAndCategorize and date interfaces", () => {
        let client = new SearchClient("http://localhost:9950");
        client.categorize.categories = reference;

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

        // go
        expect(client.findAndCategorize).toBeDefined();

        let from = {M: -2};
        client.dateFrom = from;
        expect(client.dateFrom).toEqual(from);

        let to = {M: -1};
        client.dateTo = to;
        expect(client.dateTo).toEqual(to);

        let now = new Date();
        let qConverter = (<any> new QueryFindConverterV3());
        let params = qConverter.getUrlParams(client.query);
        let df = params.find((key) => key.split("=")[0] === "df");
        let dt = params.find((key) => key.split("=")[0] === "dt");
        let dateFrom = new Date(decodeURIComponent(df.split("=")[1]));
        let dateTo = new Date(decodeURIComponent(dt.split("=")[1]));

        // Expecting the from-date to be two months back in time. 
        const fromDiff = Math.round((now.valueOf() - dateFrom.valueOf()) / (1000 * 60 * 60 * 24));
        // Expecting the to-date to be one month back in time. 
        const toDiff = Math.round((now.valueOf() - dateTo.valueOf()) / (1000 * 60 * 60 * 24));

        expect(fromDiff).toBeGreaterThanOrEqual(59); // shortest two months = 28+31
        expect(fromDiff).toBeLessThanOrEqual(62); // longest two months = 31+31
        expect(toDiff).toBeGreaterThanOrEqual(28); // shortest month = 28
        expect(toDiff).toBeLessThanOrEqual(31); // Longest month = 31
    });

    it("Search instance with empty settings should have expected query interfaces", () => {
        let settings = new Settings({
            find: {
                cbRequest: jest.fn(() => {return false; } ),
                cbSuccess: jest.fn(),
                triggers: {
                    queryChange: true,
                    queryChangeInstantRegex: /\S $/,
                },
            },
        });

        let client = new SearchClient("http://localhost:9950", settings);
        let pClient = <any> client;
        
        const autocompleteFetch = jest.fn();
        (<any> client.autocomplete).fetch = autocompleteFetch;

        const categorizeFetch = jest.fn();
        (<any> client.categorize).fetch = categorizeFetch;

        const findFetch = jest.fn();
        (<any> client.find).fetch = findFetch;

        // With current settings none of the services should update for queryText="test"
        client.queryText = "test";
        expect(pClient.settings.query.queryText).toEqual("test");
        expect(pClient.settings.find.triggers.queryChange).toEqual(true);
        expect(pClient.find.settings.triggers.queryChange).toEqual(true);
        expect(pClient.settings.find.triggers.queryChangeInstantRegex).toEqual(/\S $/);
        expect(pClient.find.settings.triggers.queryChangeInstantRegex).toEqual(/\S $/);
        expect(autocompleteFetch).not.toBeCalled(); autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled(); categorizeFetch.mockReset();
        expect(findFetch).not.toBeCalled(); findFetch.mockReset();

        // But, if the query ends with a space then the find-service should update (has callback and has enabled queryChangeTrigger and set instanceRegex)
        client.queryText = "test ";
        expect(pClient.settings.query.queryText).toEqual("test ");
        expect(autocompleteFetch).not.toBeCalled(); autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled(); categorizeFetch.mockReset();
        expect(findFetch).toBeCalled(); findFetch.mockReset();

        // But, if we do the same, this time while deferring updates, the update should not be called.
        client.deferUpdates(true);
        client.queryText = "test";
        client.queryText = "test ";
        expect(pClient.settings.query.queryText).toEqual("test ");
        expect(autocompleteFetch).not.toBeCalled(); autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled(); categorizeFetch.mockReset();
        expect(findFetch).not.toBeCalled(); findFetch.mockReset();

        // At least not until we again open up the deferring
        client.deferUpdates(false);
        expect(autocompleteFetch).not.toBeCalled(); autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled(); categorizeFetch.mockReset();
        expect(findFetch).toHaveBeenCalledTimes(1); findFetch.mockReset();

        // We try once more to defer updates
        client.deferUpdates(true);
        client.queryText = "test";
        client.queryText = "test ";
        expect(pClient.settings.query.queryText).toEqual("test ");
        expect(autocompleteFetch).not.toBeCalled(); autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled(); categorizeFetch.mockReset();
        expect(findFetch).not.toBeCalled(); findFetch.mockReset();

        // But this time we open and skipPending updates when clearing the defer
        client.deferUpdates(false, true);
        expect(autocompleteFetch).not.toBeCalled(); autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled(); categorizeFetch.mockReset();
        expect(findFetch).not.toBeCalled(); findFetch.mockReset();
        
    });

    it("should be able to get correct full url for lookups", () => {
        let urlFindResult: string;
        let mockFindRequest = jest.fn((url: string, reqInit: RequestInit) => {
            urlFindResult = url;
            return false;
        });

        let urlCatResult: string;
        let mockCatRequest = jest.fn((url: string, reqInit: RequestInit) => {
            urlCatResult = url;
            return false;
        });

        let mockFindSuccess = jest.fn();
        let mockCatSuccess = jest.fn();

        let client = new SearchClient("http://localhost:9950/", {
            find: {
                cbRequest: mockFindRequest,
                cbSuccess: mockFindSuccess,
            },
            categorize: {
                cbRequest: mockCatRequest,
                cbSuccess: mockCatSuccess,
            },
        });

        client.queryText = "test\n";
        expect(mockFindRequest).toHaveBeenCalledTimes(1); 
        expect(mockCatRequest).toHaveBeenCalledTimes(1); 
        expect(urlFindResult).toEqual("http://localhost:9950/RestService/v3/search/find?g=false&o=Relevance&p=0&q=test%0A&s=10&t=Keywords");
        expect(urlCatResult).toEqual("http://localhost:9950/RestService/v3/search/categorize?q=test%0A&t=Keywords");
    });
});
