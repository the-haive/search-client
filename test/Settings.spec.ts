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

        expect (settings.authentication.cbBusy).toBeUndefined();
        expect (settings.authentication.cbError).toBeUndefined();
        expect (settings.authentication.cbSuccess).toBeUndefined();
        expect (settings.autocomplete.cbBusy).toBeUndefined();
        expect (settings.autocomplete.cbError).toBeUndefined();
        expect (settings.autocomplete.cbSuccess).toBeUndefined();
        expect (settings.categorize.cbBusy).toBeUndefined();
        expect (settings.categorize.cbError).toBeUndefined();
        expect (settings.categorize.cbSuccess).toBeUndefined();
        expect (settings.find.cbBusy).toBeUndefined();
        expect (settings.find.cbError).toBeUndefined();
        expect (settings.find.cbSuccess).toBeUndefined();

        let fnBusy = (isBusy: boolean, url: string, reqInit: RequestInit) => { /* dummy */};
        let fnError = (error: any) => { /* dummy */};
        let fnSuccessAutocomplete = (suggestions: string[]) => { /* dummy */};
        let fnSuccessCategorize = (categories: Categories) => { /* dummy */};
        let fnSuccessFind = (matches: Matches) => { /* dummy */};

        settings = {
            authentication: { enabled: false },
            autocomplete: {
                cbBusy: fnBusy,
                cbError: fnError,
                cbSuccess: fnSuccessAutocomplete,
            },
            categorize: {
                cbBusy: fnBusy,
                cbError: fnError,
                cbSuccess: fnSuccessCategorize,
            },
            find: { 
                cbBusy: fnBusy,
                cbError: fnError,
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

        expect (settings.authentication.cbBusy).toBeUndefined();
        expect (settings.authentication.cbError).toBeUndefined();
        expect (settings.authentication.cbSuccess).toBeUndefined();
        expect (settings.autocomplete.cbBusy).toBeDefined();
        expect (settings.autocomplete.cbError).toBeDefined();
        expect (settings.autocomplete.cbSuccess).toBeDefined();
        expect (settings.categorize.cbBusy).toBeDefined();
        expect (settings.categorize.cbError).toBeDefined();
        expect (settings.categorize.cbSuccess).toBeDefined();
        expect (settings.find.cbBusy).toBeDefined();
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

        expect (settings.authentication.cbBusy).toBeUndefined();
        expect (settings.authentication.cbError).toBeUndefined();
        expect (settings.authentication.cbSuccess).toBeUndefined();
        expect (settings.autocomplete.cbBusy).toBeDefined();
        expect (settings.autocomplete.cbError).toBeDefined();
        expect (settings.autocomplete.cbSuccess).toBeDefined();
        expect (settings.categorize.cbBusy).toBeDefined();
        expect (settings.categorize.cbError).toBeDefined();
        expect (settings.categorize.cbSuccess).toBeDefined();
        expect (settings.find.cbBusy).toBeDefined();
        expect (settings.find.cbError).toBeDefined();
        expect (settings.find.cbSuccess).toBeDefined();
    });

});
