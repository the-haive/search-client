import fetch from "jest-fetch-mock";

import { Find, FindSettings, IFindSettings, FindTriggers } from ".";
import { Matches } from "../Data";

describe("Find basics", () => {
    it("Should have imported Find class defined", () => {
        expect(typeof Find).toBe("function");
    });

    it("Should be able to create Find instance", () => {
        let find = new Find("http://localhost:9950/");
        let pFind = find as any;

        expect(typeof find).toBe("object");
        expect(find instanceof Find).toBeTruthy();
        expect(pFind.settings.enabled).toEqual(true);
        expect(pFind.settings.cbError).toBeUndefined();
        expect(pFind.settings.cbRequest).toBeUndefined();
        expect(pFind.settings.cbSuccess).toBeUndefined();
        expect(pFind.settings.triggers).toBeDefined();
        expect(pFind.settings.triggers.filterChanged).toEqual(true);
        expect(pFind.settings.url).toEqual(
            "http://localhost:9950/RestService/v4/search/find"
        );
    });

    it("Should not throw, even for invalid urls. Not perfect, but avoids an additional dependency.", () => {
        expect(() => {
            let find = new Find("file://localhost:9950");
            expect(typeof find).toBe("object");
        }).not.toThrow();

        expect(() => {
            let find = new Find("http:+//localhost:9950");
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

        let find = new Find(settings);
        let pFind = find as any;

        expect(typeof pFind.auth).toBe("object");
        expect(pFind.settings.baseUrl).toEqual("http://localhost:9950");
        expect(pFind.settings.enabled).toEqual(false);
        expect(pFind.settings.cbError).toBeDefined();
        expect(pFind.settings.cbRequest).toBeUndefined();
        expect(pFind.settings.cbSuccess).toBeDefined();
        expect(pFind.settings.triggers).toBeDefined();
        expect(pFind.settings.triggers.filterChanged).toEqual(true);
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
            cbSuccess: (data: Matches) => {
                /* dummy */
            },
            enabled: false,
            triggers: new FindTriggers(),
            basePath: "/test"
        } as IFindSettings;

        let find = new Find(settings);
        let pFind = find as any;

        expect(typeof pFind.auth).toBe("object");
        expect(pFind.settings.baseUrl).toEqual("http://localhost:9950");
        expect(pFind.settings.enabled).toEqual(false);
        expect(pFind.settings.cbError).toBeDefined();
        expect(pFind.settings.cbRequest).toBeUndefined();
        expect(pFind.settings.cbSuccess).toBeDefined();
        expect(pFind.settings.triggers).toBeDefined();
        expect(pFind.settings.triggers.filterChanged).toEqual(true);
        expect(pFind.settings.url).toEqual(
            "http://localhost:9950/test/search/find"
        );
    });

    it("Should be able to Find some results", () => {
        fetch.resetMocks();
        // Not caring about the response, just to allow the fetch to complete.
        fetch.mockResponse(JSON.stringify(null));
        let settings = {
            baseUrl: "http://localhost:9950/",
            cbRequest: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
            }),
            cbSuccess: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
            })
        } as IFindSettings;

        let find = new Find(settings, null, fetch);
        find.fetch()
            .then(response => {
                expect(typeof response).toBe("object");
            })
            .catch(error => {
                fail("Should not fail");
            })
            .then(() => {
                expect(settings.cbRequest).toHaveBeenCalled();
                expect(settings.cbSuccess).toHaveBeenCalled();
            });
    });

    it("Should be able to stop a Find using cbRequest", () => {
        fetch.resetMocks();
        // Not caring about the response, just to stop the fetch from completing.
        fetch.mockResponse(JSON.stringify(null));
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

        let find = new Find(settings, null, fetch);
        find.fetch()
            .then(response => {
                expect(response).toBeNull();
            })
            .catch(error => {
                fail("Should not yield an error");
            })
            .then(() => {
                expect(settings.cbRequest).toHaveBeenCalled();
                expect(settings.cbSuccess).not.toHaveBeenCalled();
            });
    });
});
