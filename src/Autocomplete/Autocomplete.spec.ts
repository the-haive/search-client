import fetch from "jest-fetch-mock";

import { Autocomplete, AutocompleteSettings, AutocompleteTriggers } from ".";
import { Query } from "../Common";

describe("Autocomplete basics", () => {
    it("Should have imported Autocomplete class defined", () => {
        expect(typeof Autocomplete).toBe("function");
    });

    it("Should be able to create Autocomplete instance", () => {
        let autocomplete = new Autocomplete(
            "http://localhost:9950/",
            null,
            fetch
        );
        let pAutocomplete = autocomplete as any;

        expect(typeof autocomplete).toBe("object");
        expect(autocomplete instanceof Autocomplete).toBeTruthy();
        expect(pAutocomplete.settings).toBeDefined();
        expect(pAutocomplete.settings.enabled).toEqual(true);
        expect(pAutocomplete.settings.cbError).toBeUndefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeUndefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(
            true
        );
        expect(pAutocomplete.settings.url).toEqual("autocomplete");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let autocomplete = new Autocomplete(
                "file://localhost:9950",
                null,
                fetch
            );
        }).toThrow();

        expect(() => {
            let autocomplete = new Autocomplete(
                "http:+//localhost:9950",
                null,
                fetch
            );
        }).toThrow();
    });

    it("Should be able to pass a default AutocompleteSettings instance", () => {
        let autocomplete = new Autocomplete(
            "http://localhost:9950/",
            new AutocompleteSettings()
        );
        let pAutocomplete = autocomplete as any;

        expect(typeof pAutocomplete.auth).toBe("object");
        expect(pAutocomplete.settings.enabled).toEqual(true);
        expect(pAutocomplete.settings.cbError).toBeUndefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeUndefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(
            true
        );
        expect(pAutocomplete.settings.url).toEqual("autocomplete");
    });

    it("Should be able to pass an AutocompleteSettings instance with additional settings", () => {
        let settings = new AutocompleteSettings();
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.triggers = new AutocompleteTriggers();
        settings.url = "/test";

        let autocomplete = new Autocomplete(
            "http://localhost:9950/",
            settings,
            null,
            fetch
        );
        let pAutocomplete = autocomplete as any;

        expect(typeof pAutocomplete.auth).toBe("object");
        expect(autocomplete.baseUrl).toEqual(
            "http://localhost:9950/RestService/v4"
        );
        expect(pAutocomplete.settings.enabled).toEqual(false);
        expect(pAutocomplete.settings.cbError).toBeDefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeDefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(
            true
        );
        expect(pAutocomplete.settings.url).toEqual("test");
    });

    it("Should be able to pass a manual object settings as AutocompleteSettings", () => {
        let settings = {
            cbError: (error: any) => {
                /* dummy */
            },
            cbSuccess: (data: string[]) => {
                /* dummy */
            },
            enabled: false,
            triggers: new AutocompleteTriggers(),
            url: "/test"
        } as AutocompleteSettings;

        let autocomplete = new Autocomplete(
            "http://localhost:9950/",
            settings,
            null,
            fetch
        );
        let pAutocomplete = autocomplete as any;

        expect(typeof pAutocomplete.auth).toBe("object");
        expect(autocomplete.baseUrl).toEqual(
            "http://localhost:9950/RestService/v4"
        );
        expect(pAutocomplete.settings.enabled).toEqual(false);
        expect(pAutocomplete.settings.cbError).toBeDefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeDefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(
            true
        );
        expect(pAutocomplete.settings.url).toEqual("test");
    });

    it("Should be able to get some autocomplete suggestions", () => {
        // Not caring about the response, just to allow the fetch to complete.
        fetch.mockResponse(JSON.stringify(null));
        let settings = {
            cbRequest: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
                return true;
            })
        } as AutocompleteSettings;

        let autocomplete = new Autocomplete(
            "http://localhost:9950/",
            settings,
            null,
            fetch
        );
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
            });
    });

    it("Should throw error on promise when autocomplete fails", () => {
        // Not caring about the response, just to allow the fetch to complete.
        fetch.mockResponse("not json");
        let settings = {
            cbRequest: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
                return true;
            })
        } as AutocompleteSettings;

        let autocomplete = new Autocomplete(
            "http://localhost:9950/",
            settings,
            null,
            fetch
        );
        autocomplete
            .fetch()
            .then(response => {
                fail("Should not success");
            })
            .catch(error => {
                expect(error.name).toBe("FetchError");
            })
            .then(() => {
                expect(settings.cbRequest).toHaveBeenCalled();
            });
    });

    it("Should be able to stop an Autocomplete using cbRequest", () => {
        // Not caring about the response, just to allow the fetch to complete.
        fetch.mockResponse(JSON.stringify(null));
        let settings = {
            cbRequest: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
                // Stop the request
                return false;
            })
        } as AutocompleteSettings;

        let autocomplete = new Autocomplete(
            "http://localhost:9950/",
            settings,
            null,
            fetch
        );
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
            cbSuccess: jest.fn(suggestions => {
                expect(suggestions).toContain("queryTextForMe");
                expect(suggestions).toContain("queryTextForYou");
            }),
            cbError: jest.fn((suppressCallbacks, error, url, reqInit) => {
                fail("Should not have thrown an error.");
            })
        } as AutocompleteSettings;

        let autocomplete = new Autocomplete(
            "http://localhost:9950/",
            settings,
            null,
            fetch
        );
        let newQuery = new Query();
        newQuery.queryText = "queryText";
        autocomplete.queryTextChanged("", newQuery);
        expect(fetch).toHaveBeenCalledTimes(0);
        jest.runAllTimers();
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
