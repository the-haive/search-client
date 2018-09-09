import { AutocompleteSettings, IAutocompleteSettings } from ".";

describe("AutocompleteSettings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new AutocompleteSettings("http://localhost:9950/");

        expect(settings).toBeDefined();
        expect(settings instanceof AutocompleteSettings).toBeTruthy();
        expect(settings.enabled).toBeTruthy();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
        expect(settings.triggers.maxSuggestionsChanged).toEqual(true);
        expect(settings.triggers.queryChangeDelay).toEqual(200);
        expect(settings.triggers.queryChangeInstantRegex).toEqual(/\S\s$/);
        expect(settings.triggers.queryChange).toEqual(true);
        expect(settings.triggers.queryChangeMinLength).toEqual(3);
        expect(settings.url).toEqual(
            "http://localhost:9950/RestService/v4/autocomplete"
        );
    });

    it("Should be possible to pass in an IAutocompleteSettings object to use for values.", () => {
        let settings = {
            baseUrl: "http://dummy",
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
            triggers: {
                maxSuggestionsChanged: false,
                queryChange: true,
                queryChangeDelay: 100,
                queryChangeInstantRegex: /\S/,
                queryChangeMinLength: 2
            },
            basePath: "test"
        } as IAutocompleteSettings;

        settings = new AutocompleteSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AutocompleteSettings).toBeTruthy();
        expect(settings.enabled).toBeFalsy();
        expect(settings.cbRequest).toBeDefined();
        expect(settings.cbError).toBeDefined();
        expect(settings.cbSuccess).toBeDefined();
        expect(settings.triggers.maxSuggestionsChanged).toEqual(false);
        expect(settings.triggers.queryChangeDelay).toEqual(100);
        expect(settings.triggers.queryChangeInstantRegex).toEqual(/\S/);
        expect(settings.triggers.queryChange).toEqual(true);
        expect(settings.triggers.queryChangeMinLength).toEqual(2);
        expect(settings.url).toEqual("http://dummy/test/autocomplete");
    });

    it("Should be possible to pass a partial AutocompleteSettings object to use for values.", () => {
        let settings = {
            baseUrl: "http://dummy",
            cbSuccess: (suggestions: string[]) => {
                /* dummy */
            },
            enabled: false,
            triggers: {}
        } as IAutocompleteSettings;

        settings = new AutocompleteSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AutocompleteSettings).toBeTruthy();
        expect(settings.enabled).toBeFalsy();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbSuccess).toBeDefined();
        expect(settings.triggers.maxSuggestionsChanged).toEqual(true);
        expect(settings.triggers.queryChangeDelay).toEqual(200);
        expect(settings.triggers.queryChangeInstantRegex).toEqual(/\S\s$/);
        expect(settings.triggers.queryChange).toEqual(true);
        expect(settings.triggers.queryChangeMinLength).toEqual(3);
        expect(settings.url).toEqual(
            "http://dummy/RestService/v4/autocomplete"
        );
    });
});
