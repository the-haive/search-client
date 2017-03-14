// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { AutocompleteSettings } from '../src/Autocomplete';

describe("AutocompleteSettings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new AutocompleteSettings();

        expect(settings).toBeDefined();
        expect(settings instanceof AutocompleteSettings).toBeTruthy();
        expect (settings.enabled).toBeTruthy();
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeUndefined();
        expect (settings.triggers.maxSuggestionsChanged).toEqual(true);
        expect (settings.triggers.queryChangeDelay).toEqual(200);
        expect (settings.triggers.queryChangeInstantRegex).toEqual(/\S\s$/);
        expect (settings.triggers.queryChange).toEqual(true);
        expect (settings.triggers.queryChangeMinLength).toEqual(3);
        expect (settings.url).toEqual("/autocomplete");
    });

    it("Should be poassible to pass in an AutocompleteSettings object to use for values.", () => {
        let settings = {
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
            triggers: {
                maxSuggestionsChanged: false,
                queryChange: true,
                queryChangeDelay: 100,
                queryChangeInstantRegex: /\S/,
                queryChangeMinLength: 2,
            },
            url: "/test/",
        } as AutocompleteSettings;

        settings = new AutocompleteSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AutocompleteSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.triggers.maxSuggestionsChanged).toEqual(false);
        expect (settings.triggers.queryChangeDelay).toEqual(100);
        expect (settings.triggers.queryChangeInstantRegex).toEqual(/\S/);
        expect (settings.triggers.queryChange).toEqual(true);
        expect (settings.triggers.queryChangeMinLength).toEqual(2);
        expect (settings.url).toEqual("/test/");
    });

    it("Should be poassible to pass a partial AutocompleteSettings object to use for values.", () => {

        let settings = {
            cbSuccess: (suggestions: string[]) => { /* dummy */},
            enabled: false,
            triggers: {},
        } as AutocompleteSettings;

        settings = new AutocompleteSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AutocompleteSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.triggers.maxSuggestionsChanged).toEqual(true);
        expect (settings.triggers.queryChangeDelay).toEqual(200);
        expect (settings.triggers.queryChangeInstantRegex).toEqual(/\S\s$/);
        expect (settings.triggers.queryChange).toEqual(true);
        expect (settings.triggers.queryChangeMinLength).toEqual(3);
        expect (settings.url).toEqual("/autocomplete");
    });

});
