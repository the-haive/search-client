import { AllCategoriesSettings } from '../src/AllCategories';
import { AutocompleteSettings } from '../src/Autocomplete';
import { AuthenticationSettings } from '../src/Authentication';
// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { AllCategories, Authentication, Autocomplete, BestBets, Categorize, Find, SearchClient, Settings, OrderBy, SearchType, Categories, Matches } from '../src/SearchClient';

describe("Settings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new Settings();

        expect(settings).toBeDefined();
        expect(settings instanceof Settings).toBeTruthy();
        expect(settings.allCategories.enabled).toBeTruthy();
        expect(settings.authentication.enabled).toBeTruthy();
        expect(settings.autocomplete.enabled).toBeTruthy();
        expect(settings.bestBets.enabled).toBeTruthy();
        expect(settings.categorize.enabled).toBeTruthy();
        expect(settings.find.enabled).toBeTruthy();

        expect(settings.allCategories.version).toEqual(3);
        expect(settings.authentication.version).toEqual(3);
        expect(settings.autocomplete.version).toEqual(3);
        expect(settings.bestBets.version).toEqual(3);
        expect(settings.categorize.version).toEqual(3);
        expect(settings.find.version).toEqual(3);

        expect(settings.allCategories.path).toEqual("RestService/v3");
        expect(settings.authentication.path).toEqual("RestService/v3");
        expect(settings.autocomplete.path).toEqual("RestService/v3");
        expect(settings.bestBets.path).toEqual("RestService/v3");
        expect(settings.categorize.path).toEqual("RestService/v3");
        expect(settings.find.path).toEqual("RestService/v3");

        expect (settings.authentication.cbRequest).toBeUndefined();
        expect (settings.authentication.cbError).toBeUndefined();
        expect (settings.authentication.cbSuccess).toBeUndefined();
        expect (settings.autocomplete.cbRequest).toBeUndefined();
        expect (settings.autocomplete.cbError).toBeUndefined();
        expect (settings.autocomplete.cbSuccess).toBeUndefined();
        expect (settings.categorize.cbRequest).toBeUndefined();
        expect (settings.categorize.cbError).toBeUndefined();
        expect (settings.categorize.cbSuccess).toBeUndefined();
        expect (settings.find.cbRequest).toBeUndefined();
        expect (settings.find.cbError).toBeUndefined();
        expect (settings.find.cbSuccess).toBeUndefined();

        let fnRequest = (url: string, reqInit: RequestInit) => { /* dummy */};
        let fnError = (error: any) => { /* dummy */};
        let fnSuccessAutocomplete = (suggestions: string[]) => { /* dummy */};
        let fnSuccessCategorize = (categories: Categories) => { /* dummy */};
        let fnSuccessFind = (matches: Matches) => { /* dummy */};

        settings = {
            authentication: { enabled: false },
            autocomplete: {
                cbError: fnError,
                cbRequest: fnRequest,
                cbSuccess: fnSuccessAutocomplete,
            },
            categorize: {
                cbError: fnError,
                cbRequest: fnRequest,
                cbSuccess: fnSuccessCategorize,
            },
            find: { 
                cbError: fnError,
                cbRequest: fnRequest,
                cbSuccess: fnSuccessFind,
            },
        } as Settings;

        settings = new Settings(settings);

        expect(settings instanceof Settings).toBeTruthy();

        expect(settings.allCategories.enabled).toBeTruthy();
        expect(settings.authentication.enabled).toBeFalsy();
        expect(settings.autocomplete.enabled).toBeTruthy();
        expect(settings.bestBets.enabled).toBeTruthy();
        expect(settings.categorize.enabled).toBeTruthy();
        expect(settings.find.enabled).toBeTruthy();

        expect (settings.authentication.cbRequest).toBeUndefined();
        expect (settings.authentication.cbError).toBeUndefined();
        expect (settings.authentication.cbSuccess).toBeUndefined();
        expect (settings.autocomplete.cbRequest).toBeDefined();
        expect (settings.autocomplete.cbError).toBeDefined();
        expect (settings.autocomplete.cbSuccess).toBeDefined();
        expect (settings.categorize.cbRequest).toBeDefined();
        expect (settings.categorize.cbError).toBeDefined();
        expect (settings.categorize.cbSuccess).toBeDefined();
        expect (settings.find.cbRequest).toBeDefined();
        expect (settings.find.cbError).toBeDefined();
        expect (settings.find.cbSuccess).toBeDefined();

        settings = new Settings(settings);

        expect(settings instanceof Settings).toBeTruthy();

        expect(settings.allCategories.enabled).toBeTruthy();
        expect(settings.authentication.enabled).toBeFalsy();
        expect(settings.autocomplete.enabled).toBeTruthy();
        expect(settings.bestBets.enabled).toBeTruthy();
        expect(settings.categorize.enabled).toBeTruthy();
        expect(settings.find.enabled).toBeTruthy();

        expect (settings.authentication.cbRequest).toBeUndefined();
        expect (settings.authentication.cbError).toBeUndefined();
        expect (settings.authentication.cbSuccess).toBeUndefined();
        expect (settings.autocomplete.cbRequest).toBeDefined();
        expect (settings.autocomplete.cbError).toBeDefined();
        expect (settings.autocomplete.cbSuccess).toBeDefined();
        expect (settings.categorize.cbRequest).toBeDefined();
        expect (settings.categorize.cbError).toBeDefined();
        expect (settings.categorize.cbSuccess).toBeDefined();
        expect (settings.find.cbRequest).toBeDefined();
        expect (settings.find.cbError).toBeDefined();
        expect (settings.find.cbSuccess).toBeDefined();
    });

    it("Should be possible to override version and also get the expected path", () => {
        let settings = new Settings({version: 2} as Settings);

        expect(settings).toBeDefined();
        expect(settings.version).toEqual(2);
        expect(settings.path).toEqual("RestService/v2");
        
        expect(settings.allCategories.version).toEqual(2);
        expect(settings.authentication.version).toEqual(2);
        expect(settings.autocomplete.version).toEqual(2);
        expect(settings.bestBets.version).toEqual(2);
        expect(settings.categorize.version).toEqual(2);
        expect(settings.find.version).toEqual(2);

        expect(settings.allCategories.path).toEqual("RestService/v2");
        expect(settings.authentication.path).toEqual("RestService/v2");
        expect(settings.autocomplete.path).toEqual("RestService/v2");
        expect(settings.bestBets.path).toEqual("RestService/v2");
        expect(settings.categorize.path).toEqual("RestService/v2");
        expect(settings.find.path).toEqual("RestService/v2");
    });

    it("Should be possible to override version to same as default and get the expected path", () => {
        let settings = new Settings({version: 3} as Settings);

        expect(settings).toBeDefined();
        expect(settings.version).toEqual(3);
        expect(settings.path).toEqual("RestService/v3");

        expect(settings.allCategories.version).toEqual(3);
        expect(settings.authentication.version).toEqual(3);
        expect(settings.autocomplete.version).toEqual(3);
        expect(settings.bestBets.version).toEqual(3);
        expect(settings.categorize.version).toEqual(3);
        expect(settings.find.version).toEqual(3);

        expect(settings.allCategories.path).toEqual("RestService/v3");
        expect(settings.authentication.path).toEqual("RestService/v3");
        expect(settings.autocomplete.path).toEqual("RestService/v3");
        expect(settings.bestBets.path).toEqual("RestService/v3");
        expect(settings.categorize.path).toEqual("RestService/v3");
        expect(settings.find.path).toEqual("RestService/v3");
    });

    it("Should be possible to override the path", () => {
        let settings = new Settings({path: "CustomRestServicePath"} as Settings);

        expect(settings).toBeDefined();
        expect(settings.version).toEqual(3);
        expect(settings.path).toEqual("CustomRestServicePath");

        expect(settings.allCategories.version).toEqual(3);
        expect(settings.authentication.version).toEqual(3);
        expect(settings.autocomplete.version).toEqual(3);
        expect(settings.bestBets.version).toEqual(3);
        expect(settings.categorize.version).toEqual(3);
        expect(settings.find.version).toEqual(3);

        expect(settings.allCategories.path).toEqual("CustomRestServicePath");
        expect(settings.authentication.path).toEqual("CustomRestServicePath");
        expect(settings.autocomplete.path).toEqual("CustomRestServicePath");
        expect(settings.bestBets.path).toEqual("CustomRestServicePath");
        expect(settings.categorize.path).toEqual("CustomRestServicePath");
        expect(settings.find.path).toEqual("CustomRestServicePath");
    });

    it("Should be possible to override the path (and 'override' version to default", () => {
        let settings = new Settings({version: 3, path: "CustomRestServicePath"} as Settings);

        expect(settings).toBeDefined();
        expect(settings.version).toEqual(3);
        expect(settings.path).toEqual("CustomRestServicePath");

        expect(settings.allCategories.version).toEqual(3);
        expect(settings.authentication.version).toEqual(3);
        expect(settings.autocomplete.version).toEqual(3);
        expect(settings.bestBets.version).toEqual(3);
        expect(settings.categorize.version).toEqual(3);
        expect(settings.find.version).toEqual(3);

        expect(settings.allCategories.path).toEqual("CustomRestServicePath");
        expect(settings.authentication.path).toEqual("CustomRestServicePath");
        expect(settings.autocomplete.path).toEqual("CustomRestServicePath");
        expect(settings.bestBets.path).toEqual("CustomRestServicePath");
        expect(settings.categorize.path).toEqual("CustomRestServicePath");
        expect(settings.find.path).toEqual("CustomRestServicePath");
    });

    it("Should be possible to override the version and path", () => {
        let settings = new Settings({version: 2, path: "CustomRestServicePath"} as Settings);

        expect(settings).toBeDefined();
        expect(settings.version).toEqual(2);
        expect(settings.path).toEqual("CustomRestServicePath");

        expect(settings.allCategories.version).toEqual(2);
        expect(settings.authentication.version).toEqual(2);
        expect(settings.autocomplete.version).toEqual(2);
        expect(settings.bestBets.version).toEqual(2);
        expect(settings.categorize.version).toEqual(2);
        expect(settings.find.version).toEqual(2);

        expect(settings.allCategories.path).toEqual("CustomRestServicePath");
        expect(settings.authentication.path).toEqual("CustomRestServicePath");
        expect(settings.autocomplete.path).toEqual("CustomRestServicePath");
        expect(settings.bestBets.path).toEqual("CustomRestServicePath");
        expect(settings.categorize.path).toEqual("CustomRestServicePath");
        expect(settings.find.path).toEqual("CustomRestServicePath");
    });

    it("Should throw on unsupported version numbers", () => {
        expect(() => {
            let settings = new Settings({version: 1} as Settings);
        }).toThrow();

        expect(() => {
            let settings = new Settings({version: 4} as Settings);
        }).toThrow();
    });

});
