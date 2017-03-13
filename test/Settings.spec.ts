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

});
