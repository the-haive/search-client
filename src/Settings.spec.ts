import { Settings, ISettings, Categories, Matches } from "../src/SearchClient";

describe("Settings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new Settings("http://dummy");

        expect(settings).toBeDefined();
        expect(settings instanceof Settings).toBeTruthy();
        expect(settings.authentication.enabled).toBeFalsy();
        expect(settings.autocomplete.enabled).toBeTruthy();
        expect(settings.categorize.enabled).toBeTruthy();
        expect(settings.find.enabled).toBeTruthy();

        expect(settings.authentication.basePath).toEqual("RestService/v4");
        expect(settings.autocomplete.basePath).toEqual("RestService/v4");
        expect(settings.categorize.basePath).toEqual("RestService/v4");
        expect(settings.find.basePath).toEqual("RestService/v4");

        expect(settings.authentication.cbRequest).toBeUndefined();
        expect(settings.authentication.cbError).toBeUndefined();
        expect(settings.authentication.cbSuccess).toBeUndefined();
        expect(settings.autocomplete.cbRequest).toBeUndefined();
        expect(settings.autocomplete.cbError).toBeUndefined();
        expect(settings.autocomplete.cbSuccess).toBeUndefined();
        expect(settings.categorize.cbRequest).toBeUndefined();
        expect(settings.categorize.cbError).toBeUndefined();
        expect(settings.categorize.cbSuccess).toBeUndefined();
        expect(settings.find.cbRequest).toBeUndefined();
        expect(settings.find.cbError).toBeUndefined();
        expect(settings.find.cbSuccess).toBeUndefined();

        let fnRequest = (url: string, reqInit: RequestInit) => {
            /* dummy */
        };
        let fnError = (error: any) => {
            /* dummy */
        };
        let fnSuccessAutocomplete = (suggestions: string[]) => {
            /* dummy */
        };
        let fnSuccessCategorize = (categories: Categories) => {
            /* dummy */
        };
        let fnSuccessFind = (matches: Matches) => {
            /* dummy */
        };

        let settings2 = {
            baseUrl: "http://dummy",
            authentication: { enabled: false },
            autocomplete: {
                cbError: fnError,
                cbRequest: fnRequest,
                cbSuccess: fnSuccessAutocomplete
            },
            categorize: {
                cbError: fnError,
                cbRequest: fnRequest,
                cbSuccess: fnSuccessCategorize
            },
            find: {
                cbError: fnError,
                cbRequest: fnRequest,
                cbSuccess: fnSuccessFind
            }
        } as ISettings;

        let actualSettings = new Settings(settings2);

        expect(actualSettings instanceof Settings).toBeTruthy();

        expect(actualSettings.authentication.enabled).toBeFalsy();
        expect(actualSettings.autocomplete.enabled).toBeTruthy();
        expect(actualSettings.categorize.enabled).toBeTruthy();
        expect(actualSettings.find.enabled).toBeTruthy();

        expect(actualSettings.authentication.cbRequest).toBeUndefined();
        expect(actualSettings.authentication.cbError).toBeUndefined();
        expect(actualSettings.authentication.cbSuccess).toBeUndefined();
        expect(actualSettings.autocomplete.cbRequest).toBeDefined();
        expect(actualSettings.autocomplete.cbError).toBeDefined();
        expect(actualSettings.autocomplete.cbSuccess).toBeDefined();
        expect(actualSettings.categorize.cbRequest).toBeDefined();
        expect(actualSettings.categorize.cbError).toBeDefined();
        expect(actualSettings.categorize.cbSuccess).toBeDefined();
        expect(actualSettings.find.cbRequest).toBeDefined();
        expect(actualSettings.find.cbError).toBeDefined();
        expect(actualSettings.find.cbSuccess).toBeDefined();

        actualSettings = new Settings(settings2);

        expect(settings instanceof Settings).toBeTruthy();

        expect(actualSettings.authentication.enabled).toBeFalsy();
        expect(actualSettings.autocomplete.enabled).toBeTruthy();
        expect(actualSettings.categorize.enabled).toBeTruthy();
        expect(actualSettings.find.enabled).toBeTruthy();

        expect(actualSettings.authentication.cbRequest).toBeUndefined();
        expect(actualSettings.authentication.cbError).toBeUndefined();
        expect(actualSettings.authentication.cbSuccess).toBeUndefined();
        expect(actualSettings.autocomplete.cbRequest).toBeDefined();
        expect(actualSettings.autocomplete.cbError).toBeDefined();
        expect(actualSettings.autocomplete.cbSuccess).toBeDefined();
        expect(actualSettings.categorize.cbRequest).toBeDefined();
        expect(actualSettings.categorize.cbError).toBeDefined();
        expect(actualSettings.categorize.cbSuccess).toBeDefined();
        expect(actualSettings.find.cbRequest).toBeDefined();
        expect(actualSettings.find.cbError).toBeDefined();
        expect(actualSettings.find.cbSuccess).toBeDefined();
    });

    it("Should be possible to override the path", () => {
        let settings = new Settings({
            baseUrl: "http://dummy",
            basePath: "CustomRestServicePath"
        } as ISettings);

        expect(settings).toBeDefined();
        expect(settings.basePath).toEqual("CustomRestServicePath");

        expect(settings.authentication.basePath).toEqual(
            "CustomRestServicePath"
        );
        expect(settings.autocomplete.basePath).toEqual("CustomRestServicePath");
        expect(settings.categorize.basePath).toEqual("CustomRestServicePath");
        expect(settings.find.basePath).toEqual("CustomRestServicePath");
    });
});
