import { AllCategoriesSettings } from '../src/AllCategories';
import { AutocompleteSettings } from '../src/Autocomplete';
import { AuthenticationSettings } from '../src/Authentication';
// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';
dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { AllCategories, Authentication, Autocomplete, BestBets, Categorize, Find, SearchClient, Settings, OrderBy, SearchType, Categories, Matches } from '../src/SearchClient';

describe("Settings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new Settings();

        expect(settings).toBeDefined();
        expect(settings.allCategories.enabled).toBeTruthy();
        expect(settings.authentication.enabled).toBeTruthy();
        expect(settings.autocomplete.enabled).toBeTruthy();
        expect(settings.bestBets.enabled).toBeTruthy();
        expect(settings.categorize.enabled).toBeTruthy();
        expect(settings.find.enabled).toBeTruthy();

        expect (settings.authentication.callback).toBeUndefined();
        expect (settings.categorize.callback).toBeUndefined();
        expect (settings.find.callback).toBeUndefined();

        let fnAutocomplete = (suggestions: string[]) => { /* dummy */};
        let fnCategorize = (categories: Categories) => { /* dummy */};
        let fnFind = (matches: Matches) => { /* dummy */};

        settings = {
            authentication: { enabled: false },
            autocomplete: {
                callback: fnAutocomplete,
            },
            categorize: {
                callback: fnCategorize,
            },
            find: { 
                callback: fnFind,
            },
        } as Settings;

        expect (settings.authentication.enabled).toBeFalsy();
        expect (settings.authentication.callback).toBeUndefined();
        expect (settings.autocomplete.enabled).toBeUndefined();
        expect (settings.autocomplete.callback).toBeDefined();
        expect (settings.categorize.enabled).toBeFalsy();
        expect (settings.categorize.callback).toBeDefined();
        expect (settings.find.enabled).toBeFalsy();
        expect (settings.find.callback).toBeDefined();

        settings = Settings.new(settings);
        expect (settings.authentication.enabled).toBeFalsy();
        expect (settings.authentication.callback).toBeUndefined();
        expect (settings.autocomplete.enabled).toBeTruthy();
        expect (settings.autocomplete.callback).toBeDefined();
        expect (settings.categorize.enabled).toBeTruthy();
        expect (settings.categorize.callback).toBeDefined();
        expect (settings.find.enabled).toBeTruthy();
        expect (settings.find.callback).toBeDefined();

    });

});
