import {FetchMock} from "jest-fetch-mock";
const fetchMock = fetch as FetchMock;

import { HapiFind, IFindSettings, FindTriggers } from ".";
import { IMatches, IMatchItem } from "../Data";

describe("Find basics", () => {
    it("Should have imported Find class defined", () => {
        expect(typeof HapiFind).toBe("function");
    });

    it("Should be able to create Find instance", () => {
        let find = new HapiFind("http://localhost:9950/");
        let pFind = find as any;

        expect(typeof find).toBe("object");
        expect(find instanceof HapiFind).toBeTruthy();
        expect(pFind.settings.enabled).toEqual(true);
        expect(pFind.settings.cbError).toBeUndefined();
        expect(pFind.settings.cbRequest).toBeUndefined();
        expect(pFind.settings.cbSuccess).toBeUndefined();
        expect(pFind.settings.triggers).toBeDefined();
        expect(pFind.settings.triggers.filtersChanged).toEqual(true);
        expect(pFind.settings.url).toEqual(
            "http://localhost:9950/RestService/v4/search/find"
        );
    });

    it("Should not throw, even for invalid urls. Not perfect, but avoids an additional dependency.", () => {
        expect(() => {
            let find = new HapiFind("file://localhost:9950");
            expect(typeof find).toBe("object");
        }).not.toThrow();

        expect(() => {
            let find = new HapiFind("http:+//localhost:9950");
            expect(typeof find).toBe("object");
        }).not.toThrow();
    });

    it("Should be able to pass an FindSettings instance with additional settings", () => {
        let settings = {} as IFindSettings;
        settings.baseUrl = "http://localhost:9950/";
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.triggers = new FindTriggers();
        settings.basePath = "/test";

        let find = new HapiFind(settings);
        let pFind = find as any;

        expect(typeof pFind.auth).toBe("object");
        expect(pFind.settings.baseUrl).toEqual("http://localhost:9950");
        expect(pFind.settings.enabled).toEqual(false);
        expect(pFind.settings.cbError).toBeDefined();
        expect(pFind.settings.cbRequest).toBeUndefined();
        expect(pFind.settings.cbSuccess).toBeDefined();
        expect(pFind.settings.triggers).toBeDefined();
        expect(pFind.settings.triggers.filtersChanged).toEqual(true);
        expect(pFind.settings.url).toEqual(
            "http://localhost:9950/test/search/find"
        );
    });

    it("Should be able to pass a manual object settings as FindSettings", () => {
        let settings = {
            baseUrl: "http://localhost:9950/",
            cbError: (error: any) => {
                /* dummy */
            },
            cbSuccess: (data: IMatches) => {
                /* dummy */
            },
            enabled: false,
            triggers: new FindTriggers(),
            basePath: "/test"
        } as IFindSettings;

        let find = new HapiFind(settings);
        let pFind = find as any;

        expect(typeof pFind.auth).toBe("object");
        expect(pFind.settings.baseUrl).toEqual("http://localhost:9950");
        expect(pFind.settings.enabled).toEqual(false);
        expect(pFind.settings.cbError).toBeDefined();
        expect(pFind.settings.cbRequest).toBeUndefined();
        expect(pFind.settings.cbSuccess).toBeDefined();
        expect(pFind.settings.triggers).toBeDefined();
        expect(pFind.settings.triggers.filtersChanged).toEqual(true);
        expect(pFind.settings.url).toEqual(
            "http://localhost:9950/test/search/find"
        );
    });

    it("Should be able to Find some results", async () => {
        fetchMock.resetMocks();
        // Not caring about the response, just to allow the fetch to complete.

        let graphQLResponse = {
            data: {
                index: {
                    items: {
                        hits: 1,
                        results: [{
                                id: "haive-cloud://1002/Content/6b01faea-afea-4324-a195-dbd2eb5cfce4",
                                parentIds: [],
                                url: "haive-cloud://1002/Content/6b01faea-afea-4324-a195-dbd2eb5cfce4",
                                title: "Automation Basics I",
                                content: "",
                                extracts: "",
                                relevance: 0.0,
                                date: "2020-02-21T10:55:36.787+01:00",
                                metadata: [{
                                        "name": "CoverTypeMetadata",
                                        "value": "Hardcover"
                                    }
                                ],
                                categories: [{
                                        "values": ["Date", "2020", "2"]
                                    }, {
                                        "values": ["FileType", "Document", "Doc"]
                                    }, {
                                        "values": ["Topic", "Engineering"]
                                    }
                                ]
                            }]
                            }
                        }
                    }
                };
         
        fetchMock.mockResponse(
            JSON.stringify(graphQLResponse),
            { 
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        let settings = {
            baseUrl: "http://localhost:9950/",
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            mode: "hapi",
            hapiIndexId: 1000,
            hapiApiKey: "api-key"
        } as IFindSettings;

        let find = new HapiFind(settings, null, fetch);
        find.fetch()
            .catch(error => {
                fail("Should not fail");
            })
            .then(() => {
                expect(settings.cbSuccess).toHaveBeenCalledTimes(1);
            });
    });

    it("Should be able to stop a Find using cbRequest", async () => {
        fetchMock.resetMocks();
        // Not caring about the response, just to stop the fetch from completing.
        fetchMock.mockResponse(JSON.stringify(null));
        let settings = {
            baseUrl: "http://localhost:9950/",
            cbRequest: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
                // Stop the request
                return false;
            }),
            cbSuccess: jest.fn()
        } as IFindSettings;

        let find = new HapiFind(settings, null, fetch);
        find.fetch()
            .then(response => {
                expect(response).toBeNull();
            })
            .catch(error => {
                fail("Should not yield an error");
            })
            .then(() => {
                expect(settings.cbRequest).toHaveBeenCalledTimes(1);
                expect(settings.cbSuccess).not.toHaveBeenCalled();
            });
    });

    it("Should be notified that the results are outdated when find queryText is changed cbResultsOutdated", () => {
        fetchMock.resetMocks();
        // Not caring about the response, just to stop the fetch from completing.
        fetchMock.mockResponse(JSON.stringify(null));
        let settings = {
            baseUrl: "http://localhost:9950/",
            cbResultState: jest.fn(),
            cbSuccess: jest.fn()
        } as IFindSettings;

        let find = new HapiFind(settings, null, fetch);
        find.update({ queryText: "search-1" });
        expect(settings.cbResultState).not.toBeCalled();
        find.shouldUpdate("queryText", { queryText: "search-1" });
        expect(settings.cbResultState).toHaveBeenCalledTimes(1);
        find.shouldUpdate("queryText", { queryText: "search-2" });
        expect(settings.cbResultState).toHaveBeenCalledTimes(2);
        find.shouldUpdate("queryText", { queryText: "search-2" });
        expect(settings.cbResultState).toHaveBeenCalledTimes(3);
    });

    it("Calls both cbSuccess and cbWarning when results indicate error via statusCode", async () => {
        fetchMock.resetMocks();
        // Not caring about the response, just to allow the fetch to complete.
        fetchMock.mockResponse(
            JSON.stringify({
                "errors": [
                  {
                    "message": "Unexpected Execution Error",
                    "locations": [
                      {
                        "line": 5,
                        "column": 5
                      }
                    ],
                    "path": [
                      "index",
                      "items"
                    ]
                  }
                ],
                "data": {
                  "index": {
                    "items": null
                  }
                }
              }),
            { 
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
       
        let cbError = jest.fn((error) => {
            fail("Should not fail");
        });

        let cbWarning = jest.fn((warning) => {
            expect(typeof warning).toBe("object");
            expect(warning.statusCode).toBe(1);
            expect(warning.message).toBe("Unexpected Execution Error|");
        });

        let cbSuccess = jest.fn((results) => {
            expect(typeof results).toBe("object");
        });

        let settings = {
            baseUrl: "http://localhost:9950/",
            cbWarning,
            cbError,
            cbSuccess
        } as IFindSettings;

        let find = new HapiFind(settings, null, fetch);
        try {
            const response = await find.fetch();
            expect(response.estimatedMatchCount).toEqual(0);
        } catch (error) {
            fail("Should not fail");
        }
        expect(settings.cbError).toHaveBeenCalledTimes(0);
        expect(settings.cbWarning).toHaveBeenCalledTimes(1);
        expect(settings.cbSuccess).toHaveBeenCalledTimes(1);
    });
});
