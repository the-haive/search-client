import {
    Query,
    SearchClient,
    Settings,
    OrderBy,
    SearchType,
    CategorizeQueryConverter
} from "./SearchClient";

import reference from "./test-data/categories.json";
import { ISettings } from "./Settings";

describe("SearchClient basics", () => {
    it("Should have imported SearchClient class defined", () => {
        expect(typeof SearchClient).toBe("function");
    });

    it("Should be able to create SearchClient instance", () => {
        let searchClient = new SearchClient("http://localhost:9950");
        expect(typeof searchClient).toBe("object");
        expect((searchClient.find as any).settings.baseUrl).toEqual(
            "http://localhost:9950"
        );
    });

    it("Should be able to ", () => {
        let searchClient = new SearchClient("http://localhost:9950");
        expect(typeof searchClient).toBe("object");
    });

    it("Should not throw, even for invalid urls. Not perfect, but avoids an additional dependency.", () => {
        expect(() => {
            let searchClient = new SearchClient("file://localhost:9950");
            expect(typeof searchClient).toBe("object");
        }).not.toThrow();

        expect(() => {
            let searchClient = new SearchClient("http:+//localhost:9950");
            expect(typeof searchClient).toBe("object");
        }).not.toThrow();
    });

    it("Search instance with empty settings should have autocomplete(), find(), categorize(), allCategories() and bestBets() interface", () => {
        let searchClient = new SearchClient("http://localhost:9950");

        expect(searchClient.authentication.shouldUpdate()).toBeFalsy();
        expect(searchClient.autocomplete.shouldUpdate()).toBeFalsy();
        expect(searchClient.categorize.shouldUpdate()).toBeFalsy();
        expect(searchClient.find.shouldUpdate()).toBeFalsy();
    });
});

describe("SearchClient settings", () => {
    it("Search instance with disabled 'services' should not have active autocomplete(), find( and categorize() instances", () => {
        let searchClient = new SearchClient({
            baseUrl: "http://localhost:9950",
            authentication: { enabled: false },
            autocomplete: { enabled: false },
            categorize: { enabled: false },
            find: { enabled: false }
        } as Settings);

        expect(searchClient.authentication.shouldUpdate()).toBeFalsy();
        expect(searchClient.autocomplete.shouldUpdate()).toBeFalsy();
        expect(searchClient.categorize.shouldUpdate()).toBeFalsy();
        expect(searchClient.find.shouldUpdate()).toBeFalsy();
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

    it("Should be possible to just set the baseUrl and have the various services acquire sensible defaults.", () => {
        let pClient = new SearchClient("http://dummy") as any;

        expect(pClient.authentication.settings.baseUrl).toEqual("http://dummy");
        expect(pClient.authentication.settings.basePath).toEqual(
            "RestService/v4"
        );
        expect(pClient.authentication.settings.servicePath).toEqual(
            "auth/login"
        );
        expect(pClient.authentication.settings.url).toEqual(
            "http://dummy/RestService/v4/auth/login"
        );

        expect(pClient.autocomplete.settings.baseUrl).toEqual("http://dummy");
        expect(pClient.autocomplete.settings.basePath).toEqual(
            "RestService/v4"
        );
        expect(pClient.autocomplete.settings.servicePath).toEqual(
            "autocomplete"
        );
        expect(pClient.autocomplete.settings.url).toEqual(
            "http://dummy/RestService/v4/autocomplete"
        );

        expect(pClient.categorize.settings.baseUrl).toEqual("http://dummy");
        expect(pClient.categorize.settings.basePath).toEqual("RestService/v4");
        expect(pClient.categorize.settings.servicePath).toEqual(
            "search/categorize"
        );
        expect(pClient.categorize.settings.url).toEqual(
            "http://dummy/RestService/v4/search/categorize"
        );

        expect(pClient.find.settings.baseUrl).toEqual("http://dummy");
        expect(pClient.find.settings.basePath).toEqual("RestService/v4");
        expect(pClient.find.settings.servicePath).toEqual("search/find");
        expect(pClient.find.settings.url).toEqual(
            "http://dummy/RestService/v4/search/find"
        );
    });

    it("Should be possible to override the basePath for services", () => {
        let pClient = new SearchClient({
            baseUrl: "http://dummy",
            basePath: "test"
        }) as any;

        expect(pClient.authentication.settings.baseUrl).toEqual("http://dummy");
        expect(pClient.authentication.settings.basePath).toEqual("test");
        expect(pClient.authentication.settings.servicePath).toEqual(
            "auth/login"
        );
        expect(pClient.authentication.settings.url).toEqual(
            "http://dummy/test/auth/login"
        );

        expect(pClient.autocomplete.settings.baseUrl).toEqual("http://dummy");
        expect(pClient.autocomplete.settings.basePath).toEqual("test");
        expect(pClient.autocomplete.settings.servicePath).toEqual(
            "autocomplete"
        );
        expect(pClient.autocomplete.settings.url).toEqual(
            "http://dummy/test/autocomplete"
        );

        expect(pClient.categorize.settings.baseUrl).toEqual("http://dummy");
        expect(pClient.categorize.settings.basePath).toEqual("test");
        expect(pClient.categorize.settings.servicePath).toEqual(
            "search/categorize"
        );
        expect(pClient.categorize.settings.url).toEqual(
            "http://dummy/test/search/categorize"
        );

        expect(pClient.find.settings.baseUrl).toEqual("http://dummy");
        expect(pClient.find.settings.basePath).toEqual("test");
        expect(pClient.find.settings.servicePath).toEqual("search/find");
        expect(pClient.find.settings.url).toEqual(
            "http://dummy/test/search/find"
        );
    });

    it("Should be possible to override the baseUrl and basePath for authentication service", () => {
        let pClient = new SearchClient({
            baseUrl: "http://dummy",
            authentication: {
                baseUrl: "http://auth-server",
                basePath: ""
            }
        }) as any;

        expect(pClient.authentication.settings.baseUrl).toEqual(
            "http://auth-server"
        );
        expect(pClient.authentication.settings.basePath).toEqual("");
        expect(pClient.authentication.settings.servicePath).toEqual(
            "auth/login"
        );
        expect(pClient.authentication.settings.url).toEqual(
            "http://auth-server/auth/login"
        );
    });
});

describe("SearchClient filter interface", () => {
    it("Should have working filter interfaces", () => {
        let client = new SearchClient("http://localhost:9950");
        client.categorize.categories = reference;

        // filters
        expect(client.filters).toHaveLength(0);
        const filterSystemFileTestdataNorway = client.categorize.createCategoryFilter(
            ["System", "File", "Testdata", "Norway"]
        );
        const filterSystemFile = client.categorize.createCategoryFilter([
            "System",
            "File"
        ]);
        const filterAuthorLarsFrode = client.categorize.createCategoryFilter([
            "Author",
            "Lars Frode"
        ]);
        const filterFileTypeDoc = client.categorize.createCategoryFilter([
            "FileType",
            "DOC"
        ]);

        expect(client.filters).toHaveLength(0);
        expect(client.filters).not.toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);
        expect(client.filters).not.toContainEqual(filterSystemFile);

        client.filterAdd(filterSystemFile);
        expect(client.filters).toHaveLength(1);
        expect(client.filters).not.toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);
        expect(client.filters).toContainEqual(filterSystemFile);

        // Adding a child should remove the parent (still only one filter)
        client.filterAdd(filterSystemFileTestdataNorway);
        expect(client.filters).toHaveLength(1);
        expect(client.filters).not.toContainEqual(filterAuthorLarsFrode);
        expect(client.filters).not.toContainEqual(filterFileTypeDoc);
        expect(client.filters).toContainEqual(filterSystemFileTestdataNorway);

        // Adding a parent should remove the child (still only one filter)
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
        expect(() => {
            client.matchPage = 0;
        }).toThrow();
        expect(client.matchPage).toEqual(1);
        client.matchPagePrev();
        expect(client.matchPage).toEqual(1);
        client.matchPageNext();
        expect(client.matchPage).toEqual(2);
        client.matchPagePrev();
        expect(client.matchPage).toEqual(1);

        // matchPageSize
        expect(() => {
            client.matchPageSize = 0;
        }).toThrow();
        expect(client.matchPageSize).toEqual(10);
        client.matchPageSize = 1;
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
        expect(client.update).toBeDefined();
        expect(client.forceUpdate).toBeDefined();

        let from = { M: -2 };
        client.dateFrom = from;
        expect(client.dateFrom).toEqual(from);

        let to = { M: -1 };
        client.dateTo = to;
        expect(client.dateTo).toEqual(to);

        let now = new Date();
        let qConverter = new CategorizeQueryConverter() as any;
        let params = qConverter.getUrlParams(client.query);
        let df = params.find((key: string) => key.split("=")[0] === "df");
        let dt = params.find((key: string) => key.split("=")[0] === "dt");
        let dateFrom = new Date(decodeURIComponent(df.split("=")[1]));
        let dateTo = new Date(decodeURIComponent(dt.split("=")[1]));

        // Expecting the from-date to be two months back in time.
        const fromDiff = Math.round(
            (now.valueOf() - dateFrom.valueOf()) / (1000 * 60 * 60 * 24)
        );
        // Expecting the to-date to be one month back in time.
        const toDiff = Math.round(
            (now.valueOf() - dateTo.valueOf()) / (1000 * 60 * 60 * 24)
        );

        expect(fromDiff).toBeGreaterThanOrEqual(59); // shortest two months = 28+31
        expect(fromDiff).toBeLessThanOrEqual(62); // longest two months = 31+31
        expect(toDiff).toBeGreaterThanOrEqual(28); // shortest month = 28
        expect(toDiff).toBeLessThanOrEqual(31); // Longest month = 31
    });

    it("Search instance with empty settings should have expected query interfaces", () => {
        jest.useFakeTimers();

        let settings = new Settings({
            baseUrl: "http://localhost:9950",
            find: {
                cbRequest: jest.fn(() => false),
                cbSuccess: jest.fn(),
                triggers: {
                    queryChange: true,
                    queryChangeInstantRegex: /\S $/
                }
            }
        });

        let client = new SearchClient(settings);
        let pClient = client as any;

        const autocompleteFetch = jest.fn();
        pClient.autocomplete.fetch = autocompleteFetch;

        const categorizeFetch = jest.fn();
        pClient.categorize.fetch = categorizeFetch;

        const findFetch = jest.fn();
        pClient.find.fetch = findFetch;

        // With current settings none of the services should update for queryText="test"
        client.queryText = "test";
        expect(pClient.settings.query.queryText).toEqual("test");
        expect(pClient.settings.find.triggers.queryChange).toEqual(true);
        expect(pClient.find.settings.triggers.queryChange).toEqual(true);
        expect(pClient.settings.find.triggers.queryChangeInstantRegex).toEqual(
            /\S $/
        );
        expect(pClient.find.settings.triggers.queryChangeInstantRegex).toEqual(
            /\S $/
        );
        expect(autocompleteFetch).not.toBeCalled();
        autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled();
        categorizeFetch.mockReset();
        expect(findFetch).not.toBeCalled();
        findFetch.mockReset();

        // But, if the query ends with a space then the find-service should update (has callback and has enabled queryChangeTrigger and set instanceRegex)
        client.queryText = "test ";
        expect(pClient.settings.query.queryText).toEqual("test ");
        expect(autocompleteFetch).not.toBeCalled();
        autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled();
        categorizeFetch.mockReset();
        expect(findFetch).toBeCalled();
        findFetch.mockReset();

        // But, if we do the same, this time while deferring updates, the update should not be called.
        client.deferUpdates(true);
        client.queryText = "test";
        client.queryText = "test ";
        jest.runAllTimers();
        expect(pClient.settings.query.queryText).toEqual("test ");
        expect(autocompleteFetch).not.toBeCalled();
        autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled();
        categorizeFetch.mockReset();
        expect(findFetch).not.toBeCalled();
        findFetch.mockReset();

        // At least not until we again open up the deferring
        client.deferUpdates(false, false);
        jest.runAllTimers();
        expect(autocompleteFetch).not.toBeCalled();
        autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled();
        categorizeFetch.mockReset();
        expect(findFetch).toHaveBeenCalledTimes(1);
        findFetch.mockReset();

        // We try once more to defer updates
        client.deferUpdates(true);
        client.queryText = "test";
        client.queryText = "test ";
        expect(pClient.settings.query.queryText).toEqual("test ");
        expect(autocompleteFetch).not.toBeCalled();
        autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled();
        categorizeFetch.mockReset();
        expect(findFetch).not.toBeCalled();
        findFetch.mockReset();

        // But this time we open and skipPending updates when clearing the defer
        client.deferUpdates(false, true);
        expect(autocompleteFetch).not.toBeCalled();
        autocompleteFetch.mockReset();
        expect(categorizeFetch).not.toBeCalled();
        categorizeFetch.mockReset();
        expect(findFetch).not.toBeCalled();
        findFetch.mockReset();
    });

    it("should be able to get correct full url for lookups", () => {
        let urlFindResult: string;
        let mockFindRequest = jest.fn((url: string) => {
            urlFindResult = url;
            return false;
        });

        let urlCatResult: string;
        let mockCatRequest = jest.fn((url: string) => {
            urlCatResult = url;
            return false;
        });

        let mockFindSuccess = jest.fn();
        let mockCatSuccess = jest.fn();

        let client = new SearchClient({
            baseUrl: "http://localhost:9950/",
            find: {
                cbRequest: mockFindRequest,
                cbSuccess: mockFindSuccess
            },
            categorize: {
                cbRequest: mockCatRequest,
                cbSuccess: mockCatSuccess
            }
        });

        client.queryText = "test\n";
        expect(mockFindRequest).toHaveBeenCalledTimes(1);
        expect(mockCatRequest).toHaveBeenCalledTimes(1);
        expect(urlFindResult).toEqual(
            "http://localhost:9950/RestService/v4/search/find?g=false&gc=false&gch=true&o=Relevance&p=1&q=test%0A&s=10&t=Keywords"
        );
        expect(urlCatResult).toEqual(
            "http://localhost:9950/RestService/v4/search/categorize?ct=All&q=test%0A&t=Keywords"
        );
    });

    it("Should allow using default query-values via settings", () => {
        let urlFindResult: string;
        let mockFindRequest = jest.fn((url: string) => {
            urlFindResult = url;
            return false;
        });

        let urlCatResult: string;
        let mockCatRequest = jest.fn((url: string) => {
            urlCatResult = url;
            return false;
        });

        let mockFindSuccess = jest.fn();
        let mockCatSuccess = jest.fn();

        let client = new SearchClient({
            baseUrl: "http://localhost:9950/",
            find: {
                cbRequest: mockFindRequest,
                cbSuccess: mockFindSuccess
            },
            categorize: {
                cbRequest: mockCatRequest,
                cbSuccess: mockCatSuccess
            },
            query: {
                matchGrouping: true
            }
        });

        client.queryText = "test\n";

        expect(mockFindRequest).toHaveBeenCalledTimes(1);
        expect(mockCatRequest).toHaveBeenCalledTimes(1);
        expect(urlFindResult).toEqual(
            "http://localhost:9950/RestService/v4/search/find?g=true&gc=false&gch=true&o=Relevance&p=1&q=test%0A&s=10&t=Keywords"
        );
        expect(urlCatResult).toEqual(
            "http://localhost:9950/RestService/v4/search/categorize?ct=All&q=test%0A&t=Keywords"
        );

        expect(client.matchGrouping).toBeTruthy();
        expect(client.query.matchGrouping).toBeTruthy();
        expect((client as any)._query.matchGrouping).toBeTruthy();

        mockFindRequest.mockReset();
        mockCatRequest.mockReset();
        client.update(); // Updating according to triggers and settings
        expect(mockFindRequest).toHaveBeenCalledTimes(1);
        expect(mockCatRequest).toHaveBeenCalledTimes(1);

        mockFindRequest.mockReset();
        mockCatRequest.mockReset();
        let q = client.query;
        q.queryText = "test2\n"; // Modifying the reference, so should already do the updates.
        client.update(q); // So the update should not do work.
        expect(mockFindRequest).toHaveBeenCalledTimes(0);
        expect(mockCatRequest).toHaveBeenCalledTimes(0);

        mockFindRequest.mockReset();
        mockCatRequest.mockReset();
        let q2 = client.query;
        q2.queryText = "test2\n"; // Modifying the reference, so should already do the updates.
        client.forceUpdate(q2); // But a forced update should still work.
        expect(mockFindRequest).toHaveBeenCalledTimes(1);
        expect(mockCatRequest).toHaveBeenCalledTimes(1);

        mockFindRequest.mockReset();
        mockCatRequest.mockReset();
        client.forceUpdate(); // And forcing without query object should also work.
        expect(mockFindRequest).toHaveBeenCalledTimes(1);
        expect(mockCatRequest).toHaveBeenCalledTimes(1);

        mockFindRequest.mockReset();
        mockCatRequest.mockReset();
        q = new Query({ queryText: "test3\n" });
        client.update(q); // Changed
        expect(mockFindRequest).toHaveBeenCalledTimes(1);
        expect(mockCatRequest).toHaveBeenCalledTimes(1);

        mockFindRequest.mockReset();
        mockCatRequest.mockReset();
        client.update(q); // No change
        expect(mockFindRequest).toHaveBeenCalledTimes(0);
        expect(mockCatRequest).toHaveBeenCalledTimes(0);

        client.forceUpdate(q); // No change, but forced
        expect(mockFindRequest).toHaveBeenCalledTimes(1);
        expect(mockCatRequest).toHaveBeenCalledTimes(1);

        mockFindRequest.mockReset();
        mockCatRequest.mockReset();
        client.update(); // No change, but forcing an update since we are not passing a query-object (if triggers allow)
        expect(mockFindRequest).toHaveBeenCalledTimes(1);
        expect(mockCatRequest).toHaveBeenCalledTimes(1);

        mockFindRequest.mockReset();
        mockCatRequest.mockReset();
        client.forceUpdate(null, false, false, false); // Forcing an update, but stopping services
        expect(mockFindRequest).toHaveBeenCalledTimes(0);
        expect(mockCatRequest).toHaveBeenCalledTimes(0);
    });
});
