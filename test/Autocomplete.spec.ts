// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { Autocomplete } from '../src/Autocomplete';
import { AutocompleteSettings } from '../src/Autocomplete/AutocompleteSettings';
import { AutocompleteTrigger } from '../src/Autocomplete/AutocompleteTrigger';

describe("Autocomplete basics", () => {

    it("Should have imported Autocomplete class defined", () => {
        expect(typeof Autocomplete).toBe("function");
    });

    it("Should be able to create Autocomplete instance", () => {
        let autocomplete = new Autocomplete("http://localhost:9950/RestService/v3/");
        let pAutocomplete = <any> autocomplete;

        expect(typeof autocomplete).toBe("object");
        expect(autocomplete instanceof Autocomplete).toBeTruthy();
        expect(pAutocomplete.settings.enabled).toEqual(true);
        expect(pAutocomplete.settings.cbError).toBeUndefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeUndefined();
        expect(pAutocomplete.settings.trigger).toBeDefined();
        expect(pAutocomplete.settings.trigger.maxSuggestionsChanged).toEqual(true);
        expect(pAutocomplete.settings.url).toEqual("/autocomplete");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let autocomplete = new Autocomplete("file://localhost:9950/RestService/v3/");
        }).toThrow();

        expect(() => {
            let autocomplete = new Autocomplete("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

    it("Should be able to pass a default AutocompleteSettings instance", () => {
        let autocomplete = new Autocomplete("http://localhost:9950/RestService/v3/", new AutocompleteSettings());
        let pAutocomplete = <any> autocomplete;

        expect(typeof pAutocomplete.auth).toBe("object");
        expect(pAutocomplete.settings.enabled).toEqual(true);
        expect(pAutocomplete.settings.cbError).toBeUndefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeUndefined();
        expect(pAutocomplete.settings.trigger).toBeDefined();
        expect(pAutocomplete.settings.trigger.maxSuggestionsChanged).toEqual(true);
        expect(pAutocomplete.settings.url).toEqual("/autocomplete");
    });

    it("Should be able to pass an AutocompleteSettings instance with additional settings", () => {
        let settings = new AutocompleteSettings();
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.trigger = new AutocompleteTrigger();
        settings.url = "/test";

        let autocomplete = new Autocomplete("http://localhost:9950/RestService/v3/", settings);
        let pAutocomplete = <any> autocomplete;

        expect(typeof pAutocomplete.auth).toBe("object");
        expect(autocomplete.baseUrl).toEqual("http://localhost:9950/RestService/v3");
        expect(pAutocomplete.settings.enabled).toEqual(false);
        expect(pAutocomplete.settings.cbError).toBeDefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeDefined();
        expect(pAutocomplete.settings.trigger).toBeDefined();
        expect(pAutocomplete.settings.trigger.maxSuggestionsChanged).toEqual(true);
        expect(pAutocomplete.settings.url).toEqual("/test");
    });

    it("Should be able to pass a manual object settings as AutocompleteSettings", () => {
        let settings = {
            cbError: (error: any) => { /* dummy */},
            cbSuccess: (data: string[]) => { /* dummy */},
            enabled: false,
            trigger: new AutocompleteTrigger(),
            url: "/test",
        } as AutocompleteSettings;

        let autocomplete = new Autocomplete("http://localhost:9950/RestService/v3/", settings);
        let pAutocomplete = <any> autocomplete;

        expect(typeof pAutocomplete.auth).toBe("object");
        expect(autocomplete.baseUrl).toEqual("http://localhost:9950/RestService/v3");
        expect(pAutocomplete.settings.enabled).toEqual(false);
        expect(pAutocomplete.settings.cbError).toBeDefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeDefined();
        expect(pAutocomplete.settings.trigger).toBeDefined();
        expect(pAutocomplete.settings.trigger.maxSuggestionsChanged).toEqual(true);
        expect(pAutocomplete.settings.url).toEqual("/test");
    });

});
