import { IFindSettings, FindSettings } from ".";
import { IMatches } from "../Data";

describe("FindSettings basics", () => {
    it("uiLanguageCodeChanged default", () => {
        const settings = new FindSettings({ baseUrl: "http://dummy" });
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(false);
    });

    it("uiLanguageCodeChanged false", () => {
        const settings = new FindSettings({
            baseUrl: "http://dummy",
            triggers: { uiLanguageCodeChanged: false }
        });
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(false);
    });

    it("uiLanguageCodeChanged true", () => {
        const settings = new FindSettings({
            baseUrl: "http://dummy",
            triggers: { uiLanguageCodeChanged: true }
        });
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(true);
    });

    it("Should be able to create a default settings object with expected values", () => {
        const settings = new FindSettings({
            baseUrl: "http://dummy"
        });

        expect(settings).toBeDefined();
        expect(settings instanceof FindSettings).toBeTruthy();
        expect(settings.enabled).toBeTruthy();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
        expect(settings.triggers.clientIdChanged).toEqual(true);
        expect(settings.triggers.dateFromChanged).toEqual(true);
        expect(settings.triggers.dateToChanged).toEqual(true);
        expect(settings.triggers.filtersChanged).toEqual(true);
        expect(settings.triggers.matchGenerateContentChanged).toEqual(true);
        expect(settings.triggers.matchGenerateContentHighlightsChanged).toEqual(
            true
        );
        expect(settings.triggers.matchGroupingChanged).toEqual(true);
        expect(settings.triggers.matchOrderByChanged).toEqual(true);
        expect(settings.triggers.matchPageChanged).toEqual(true);
        expect(settings.triggers.matchPageSizeChanged).toEqual(true);
        expect(settings.triggers.queryChangeDelay).toEqual(2000);
        expect(settings.triggers.queryChangeInstantRegex).toEqual(/\S\s$/u);
        expect(settings.triggers.queryChange).toEqual(true);
        expect(settings.triggers.queryChangeMinLength).toEqual(2);
        expect(settings.triggers.searchTypeChanged).toEqual(true);
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(false);
        expect(settings.url).toEqual("http://dummy/RestService/v4/search/find");
    });

    it("Should be possible to pass in a FindSettings object to use for values.", () => {
        const settings = {
            baseUrl: "http://dummy",
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
            triggers: {
                clientIdChanged: false,
                dateFromChanged: false,
                dateToChanged: false,
                filtersChanged: false,
                matchGenerateContentChanged: false,
                matchGroupingChanged: false,
                matchOrderByChanged: false,
                matchPageChanged: false,
                matchPageSizeChanged: false,
                queryChange: true,
                queryChangeDelay: 100,
                queryChangeInstantRegex: /\S/,
                queryChangeMinLength: 2,
                searchTypeChanged: false,
                uiLanguageCodeChanged: true
            },
            url: "/test/"
        } as IFindSettings;

        let actualSettings = new FindSettings(settings);

        expect(actualSettings).toBeDefined();
        expect(actualSettings instanceof FindSettings).toBeTruthy();
        expect(actualSettings.enabled).toBeFalsy();
        expect(actualSettings.cbRequest).toBeDefined();
        expect(actualSettings.cbError).toBeDefined();
        expect(actualSettings.cbSuccess).toBeDefined();
        expect(actualSettings.triggers.clientIdChanged).toEqual(false);
        expect(actualSettings.triggers.dateFromChanged).toEqual(false);
        expect(actualSettings.triggers.dateToChanged).toEqual(false);
        expect(actualSettings.triggers.filtersChanged).toEqual(false);
        expect(actualSettings.triggers.matchGenerateContentChanged).toEqual(
            false
        );
        expect(
            actualSettings.triggers.matchGenerateContentHighlightsChanged
        ).toEqual(true);
        expect(actualSettings.triggers.matchGroupingChanged).toEqual(false);
        expect(actualSettings.triggers.matchOrderByChanged).toEqual(false);
        expect(actualSettings.triggers.matchPageChanged).toEqual(false);
        expect(actualSettings.triggers.matchPageSizeChanged).toEqual(false);
        expect(actualSettings.triggers.queryChangeDelay).toEqual(100);
        expect(actualSettings.triggers.queryChangeInstantRegex).toEqual(/\S/);
        expect(actualSettings.triggers.queryChange).toEqual(true);
        expect(actualSettings.triggers.queryChangeMinLength).toEqual(2);
        expect(actualSettings.triggers.searchTypeChanged).toEqual(false);
        expect(actualSettings.triggers.uiLanguageCodeChanged).toEqual(true);
        expect(actualSettings.url).toEqual(
            "http://dummy/RestService/v4/search/find"
        );
    });

    it("Should be possible to pass a partial FindSettings object to use for values.", () => {
        let fnSuccess = (matches: IMatches) => {
            /* dummy */
        };

        let settings = {
            baseUrl: "http://dummy",
            cbSuccess: fnSuccess,
            enabled: false,
            triggers: {
                clientIdChanged: false,
                matchGroupingChanged: false
            }
        } as FindSettings;

        settings = new FindSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof FindSettings).toBeTruthy();
        expect(settings.enabled).toBeFalsy();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbSuccess).toBeDefined();
        expect(settings.triggers.clientIdChanged).toEqual(false);
        expect(settings.triggers.dateFromChanged).toEqual(true);
        expect(settings.triggers.dateToChanged).toEqual(true);
        expect(settings.triggers.filtersChanged).toEqual(true);
        expect(settings.triggers.matchGenerateContentChanged).toEqual(true);
        expect(settings.triggers.matchGenerateContentHighlightsChanged).toEqual(
            true
        );
        expect(settings.triggers.matchGroupingChanged).toEqual(false);
        expect(settings.triggers.matchOrderByChanged).toEqual(true);
        expect(settings.triggers.matchPageChanged).toEqual(true);
        expect(settings.triggers.matchPageSizeChanged).toEqual(true);
        expect(settings.triggers.queryChangeDelay).toEqual(2000);
        expect(settings.triggers.queryChangeInstantRegex).toEqual(/\S\s$/u);
        expect(settings.triggers.queryChange).toEqual(true);
        expect(settings.triggers.queryChangeMinLength).toEqual(2);
        expect(settings.triggers.searchTypeChanged).toEqual(true);
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(false);
        expect(settings.url).toEqual("http://dummy/RestService/v4/search/find");
    });
});
