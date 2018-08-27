import { Settings, Categories, Matches } from '../src/SearchClient';

describe('Settings basics', () => {
    it('Should be able to create a default settings object with expected values', () => {
        let settings = new Settings();

        expect(settings).toBeDefined();
        expect(settings instanceof Settings).toBeTruthy();
        expect(settings.authentication.enabled).toBeFalsy();
        expect(settings.autocomplete.enabled).toBeTruthy();
        expect(settings.categorize.enabled).toBeTruthy();
        expect(settings.find.enabled).toBeTruthy();

        expect(settings.authentication.path).toEqual('RestService/v4');
        expect(settings.autocomplete.path).toEqual('RestService/v4');
        expect(settings.categorize.path).toEqual('RestService/v4');
        expect(settings.find.path).toEqual('RestService/v4');

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

        expect(settings.authentication.enabled).toBeFalsy();
        expect(settings.autocomplete.enabled).toBeTruthy();
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

        expect(settings.authentication.enabled).toBeFalsy();
        expect(settings.autocomplete.enabled).toBeTruthy();
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

    it('Should be possible to override the path', () => {
        let settings = new Settings({path: 'CustomRestServicePath'} as Settings);

        expect(settings).toBeDefined();
        expect(settings.path).toEqual('CustomRestServicePath');

        expect(settings.authentication.path).toEqual('CustomRestServicePath');
        expect(settings.autocomplete.path).toEqual('CustomRestServicePath');
        expect(settings.categorize.path).toEqual('CustomRestServicePath');
        expect(settings.find.path).toEqual('CustomRestServicePath');
    });
});
