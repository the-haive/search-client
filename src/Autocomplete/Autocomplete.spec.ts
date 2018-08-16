import { Autocomplete, AutocompleteSettings, AutocompleteTriggers } from '.';

describe('Autocomplete basics', () => {

    it('Should have imported Autocomplete class defined', () => {
        expect(typeof Autocomplete).toBe('function');
    });

    it('Should be able to create Autocomplete instance', () => {
        let autocomplete = new Autocomplete('http://localhost:9950/');
        let pAutocomplete = autocomplete as any;

        expect(typeof autocomplete).toBe('object');
        expect(autocomplete instanceof Autocomplete).toBeTruthy();
        expect(pAutocomplete.settings).toBeDefined();
        expect(pAutocomplete.settings.enabled).toEqual(true);
        expect(pAutocomplete.settings.cbError).toBeUndefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeUndefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(true);
        expect(pAutocomplete.settings.url).toEqual('autocomplete');
    });

    it('Should throw for invalid Urls', () => {
        expect(() => {
            let autocomplete = new Autocomplete('file://localhost:9950');
        }).toThrow();

        expect(() => {
            let autocomplete = new Autocomplete('http:+//localhost:9950');
        }).toThrow();
    });

    it('Should be able to pass a default AutocompleteSettings instance', () => {
        let autocomplete = new Autocomplete('http://localhost:9950/', new AutocompleteSettings());
        let pAutocomplete = autocomplete as any;

        expect(typeof pAutocomplete.auth).toBe('object');
        expect(pAutocomplete.settings.enabled).toEqual(true);
        expect(pAutocomplete.settings.cbError).toBeUndefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeUndefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(true);
        expect(pAutocomplete.settings.url).toEqual('autocomplete');
    });

    it('Should be able to pass an AutocompleteSettings instance with additional settings', () => {
        let settings = new AutocompleteSettings();
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.triggers = new AutocompleteTriggers();
        settings.url = '/test';

        let autocomplete = new Autocomplete('http://localhost:9950/', settings);
        let pAutocomplete = autocomplete as any;

        expect(typeof pAutocomplete.auth).toBe('object');
        expect(autocomplete.baseUrl).toEqual('http://localhost:9950/RestService/v4');
        expect(pAutocomplete.settings.enabled).toEqual(false);
        expect(pAutocomplete.settings.cbError).toBeDefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeDefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(true);
        expect(pAutocomplete.settings.url).toEqual('test');
    });

    it('Should be able to pass a manual object settings as AutocompleteSettings', () => {
        let settings = {
            cbError: (error: any) => { /* dummy */},
            cbSuccess: (data: string[]) => { /* dummy */},
            enabled: false,
            triggers: new AutocompleteTriggers(),
            url: '/test',
        } as AutocompleteSettings;

        let autocomplete = new Autocomplete('http://localhost:9950/', settings);
        let pAutocomplete = autocomplete as any;

        expect(typeof pAutocomplete.auth).toBe('object');
        expect(autocomplete.baseUrl).toEqual('http://localhost:9950/RestService/v4');
        expect(pAutocomplete.settings.enabled).toEqual(false);
        expect(pAutocomplete.settings.cbError).toBeDefined();
        expect(pAutocomplete.settings.cbRequest).toBeUndefined();
        expect(pAutocomplete.settings.cbSuccess).toBeDefined();
        expect(pAutocomplete.settings.triggers).toBeDefined();
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(true);
        expect(pAutocomplete.settings.url).toEqual('test');
    });

});
