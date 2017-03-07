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
        expect (settings.cbBusy).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeUndefined();
        expect (settings.trigger.maxSuggestionsChanged).toEqual(true);
        expect (settings.trigger.queryChangeDelay).toEqual(200);
        expect (settings.trigger.queryChangeInstantRegex).toEqual(/\S\s$/);
        expect (settings.trigger.queryChange).toEqual(true);
        expect (settings.trigger.queryChangeMinLength).toEqual(3);
        expect (settings.url).toEqual("/autocomplete");
    });

    it("Should be poassible to pass in an AutocompleteSettings object to use for values.", () => {
        let fnBusy = (isBusy: boolean, url: string, reqInit: RequestInit) => { /* dummy */};
        let fnError = (error: any) => { /* dummy */};
        let fnSuccess = (suggestions: string[]) => { /* dummy */};

        let settings = {
            cbBusy: fnBusy,
            cbError: fnError,
            cbSuccess: fnSuccess,
            enabled: false,
            trigger: {
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
        expect (settings.cbBusy).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.trigger.maxSuggestionsChanged).toEqual(false);
        expect (settings.trigger.queryChangeDelay).toEqual(100);
        expect (settings.trigger.queryChangeInstantRegex).toEqual(/\S/);
        expect (settings.trigger.queryChange).toEqual(true);
        expect (settings.trigger.queryChangeMinLength).toEqual(2);
        expect (settings.url).toEqual("/test/");
    });

    it("Should be poassible to pass a partial AutocompleteSettings object to use for values.", () => {
        let fnSuccess = (suggestions: string[]) => { /* dummy */};

        let settings = {
            cbSuccess: fnSuccess,
            enabled: false,
            trigger: {},
        } as AutocompleteSettings;

        settings = new AutocompleteSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AutocompleteSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbBusy).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.trigger.maxSuggestionsChanged).toEqual(true);
        expect (settings.trigger.queryChangeDelay).toEqual(200);
        expect (settings.trigger.queryChangeInstantRegex).toEqual(/\S\s$/);
        expect (settings.trigger.queryChange).toEqual(true);
        expect (settings.trigger.queryChangeMinLength).toEqual(3);
        expect (settings.url).toEqual("/autocomplete");
    });

});
