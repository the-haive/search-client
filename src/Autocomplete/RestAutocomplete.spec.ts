import fetch from "jest-fetch-mock";

import { Autocomplete, IAutocompleteSettings, AutocompleteTriggers, RestAutocomplete } from ".";
import { Query } from "../Common";

describe("Autocomplete basics", () => {
    it("Should have imported Autocomplete class defined", () => {
        expect(typeof RestAutocomplete).toBe("function");
    });

    it("Should be able to create Autocomplete instance", () => {
        let autocomplete = new RestAutocomplete("http://localhost:9950/");
        let pAutocomplete = autocomplete as any;

        expect(typeof autocomplete).toBe("object");
        expect(autocomplete instanceof RestAutocomplete).toBeTruthy();
        expect(pAutocomplete.settings).toBeDefined();
        expect(pAutocomplete.settings.enabled).toEqual(true);
        expect(pAutocomplete.settings.cbError).toBeUndefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeUndefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(
            true
        );
        expect(pAutocomplete.settings.url).toEqual(
            "http://localhost:9950/RestService/v4/autocomplete"
        );
    });

    it("Should not throw, even for invalid urls. Not perfect, but avoids an additional dependency.", () => {
        let autocomplete = new RestAutocomplete("file://localhost:9950");
        expect(typeof autocomplete).toBe("object");

        autocomplete = new RestAutocomplete("http:+//localhost:9950");
        expect(typeof autocomplete).toBe("object");
    });

    it("Should be able to pass an AutocompleteSettings instance with additional settings", () => {
        let settings = {} as IAutocompleteSettings;
        settings.baseUrl = "http://localhost:9950/";
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.triggers = new AutocompleteTriggers();
        settings.basePath = "/test";

        let autocomplete = new RestAutocomplete(settings);
        let pAutocomplete = autocomplete as any;

        expect(typeof pAutocomplete.auth).toBe("object");
        expect(pAutocomplete.settings.baseUrl).toEqual("http://localhost:9950");
        expect(pAutocomplete.settings.enabled).toEqual(false);
        expect(pAutocomplete.settings.cbError).toBeDefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeDefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(
            true
        );
        expect(pAutocomplete.settings.url).toEqual(
            "http://localhost:9950/test/autocomplete"
        );
    });

    it("Should be able to pass a manual object settings as AutocompleteSettings", () => {
        let settings = {
            baseUrl: "http://localhost:9950/",
            cbError: (error: any) => {
                /* dummy */
            },
            cbSuccess: (data: string[]) => {
                /* dummy */
            },
            enabled: false,
            triggers: new AutocompleteTriggers(),
            basePath: "/test"
        } as IAutocompleteSettings;

        let autocomplete = new RestAutocomplete(settings);
        let pAutocomplete = autocomplete as any;

        expect(typeof pAutocomplete.auth).toBe("object");
        expect(pAutocomplete.settings.baseUrl).toEqual("http://localhost:9950");
        expect(pAutocomplete.settings.enabled).toEqual(false);
        expect(pAutocomplete.settings.cbError).toBeDefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeDefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(
            true
        );
        expect(pAutocomplete.settings.url).toEqual(
            "http://localhost:9950/test/autocomplete"
        );
    });

    it("Should be able to get some autocomplete suggestions", () => {
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
        } as IAutocompleteSettings;

        let autocomplete = new RestAutocomplete(settings, null, fetch);
        autocomplete
            .fetch()
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

    it("Should be able to stop an Autocomplete using cbRequest", () => {
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
        } as IAutocompleteSettings;

        let autocomplete = new RestAutocomplete(settings, null, fetch);
        autocomplete
            .fetch()
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

    it("Should be able to create response when changing queryText", () => {
        jest.useFakeTimers();
        // Not caring about the response, just to allow the fetch to complete.
        fetch.resetMocks();
        fetch.mockResponse(
            JSON.stringify(["queryTextForMe", "queryTextForYou"])
        );

        let settings = {
            baseUrl: "http://localhost:9950/",
            cbSuccess: jest.fn(suggestions => {
                expect(suggestions).toContain("queryTextForMe");
                expect(suggestions).toContain("queryTextForYou");
            }),
            cbError: jest.fn((suppressCallbacks, error, url, reqInit) => {
                fail("Should not have thrown an error.");
            })
        } as IAutocompleteSettings;

        let autocomplete = new RestAutocomplete(settings, null, fetch);
        let newQuery = new Query();
        newQuery.queryText = "queryText";
        autocomplete.queryTextChanged("", newQuery);
        expect(fetch).toHaveBeenCalledTimes(0);
        jest.runAllTimers();
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
