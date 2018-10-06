import { CategorizeSettings, ICategorizeSettings } from ".";
import { Categories } from "../Data";
import {
    CategoryPresentation,
    SortPartConfiguration,
    SortingConfiguration,
    GroupingConfiguration,
    GroupingMode,
    CategoryPresentationMap
} from "../Common/CategoryPresentation";

describe("CategorizeSettings basics", () => {
    it("uiLanguageCodeChanged default", () => {
        const settings = new CategorizeSettings("http://dummy");
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(true);
    });

    it("uiLanguageCodeChanged false", () => {
        const settings = new CategorizeSettings({
            baseUrl: "http://dummy",
            triggers: { uiLanguageCodeChanged: false }
        });
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(false);
    });

    it("uiLanguageCodeChanged true", () => {
        const settings = new CategorizeSettings({
            baseUrl: "http://dummy",
            triggers: { uiLanguageCodeChanged: true }
        });
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(true);
    });

    it("Should be able to create a default CategorizeSettings object with expected values", () => {
        const settings = new CategorizeSettings("http://dummy");

        expect(settings).toBeDefined();
        expect(settings instanceof CategorizeSettings).toBeTruthy();
        expect(settings.enabled).toBeTruthy();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
        expect(settings.triggers.clientIdChanged).toEqual(true);
        expect(settings.triggers.dateFromChanged).toEqual(true);
        expect(settings.triggers.dateToChanged).toEqual(true);
        expect(settings.triggers.filterChanged).toEqual(true);
        expect(settings.triggers.queryChangeDelay).toEqual(2000);
        expect(settings.triggers.queryChangeInstantRegex).toEqual(/\S\s$/u);
        expect(settings.triggers.queryChange).toEqual(true);
        expect(settings.triggers.queryChangeMinLength).toEqual(2);
        expect(settings.triggers.searchTypeChanged).toEqual(true);
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(true);
        expect(settings.url).toEqual(
            "http://dummy/RestService/v4/search/categorize"
        );
    });

    it("Should be possible to pass in a CategorizeSettings object to use for values.", () => {
        let settings = {
            baseUrl: "http://dummy",
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
            triggers: {
                clientIdChanged: false,
                dateFromChanged: false,
                dateToChanged: false,
                filterChanged: false,
                queryChange: true,
                queryChangeDelay: 100,
                queryChangeInstantRegex: /\S/,
                queryChangeMinLength: 2,
                searchTypeChanged: false,
                uiLanguageCodeChanged: false
            },
            basePath: "/test/"
        } as ICategorizeSettings;

        settings = new CategorizeSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof CategorizeSettings).toBeTruthy();
        expect(settings.enabled).toBeFalsy();
        expect(settings.cbRequest).toBeDefined();
        expect(settings.cbError).toBeDefined();
        expect(settings.cbSuccess).toBeDefined();
        expect(settings.triggers.clientIdChanged).toEqual(false);
        expect(settings.triggers.dateFromChanged).toEqual(false);
        expect(settings.triggers.dateToChanged).toEqual(false);
        expect(settings.triggers.filterChanged).toEqual(false);
        expect(settings.triggers.queryChangeDelay).toEqual(100);
        expect(settings.triggers.queryChangeInstantRegex).toEqual(/\S/);
        expect(settings.triggers.queryChange).toEqual(true);
        expect(settings.triggers.queryChangeMinLength).toEqual(2);
        expect(settings.triggers.searchTypeChanged).toEqual(false);
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(false);
        expect(settings.url).toEqual("http://dummy/test/search/categorize");
    });

    it("Should be possible to pass a partial CategorizeSettings object to use for values.", () => {
        let fnSuccess = (categories: Categories) => {
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
        } as ICategorizeSettings;

        settings = new CategorizeSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof CategorizeSettings).toBeTruthy();
        expect(settings.enabled).toBeFalsy();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbSuccess).toBeDefined();
        expect(settings.triggers.clientIdChanged).toEqual(false);
        expect(settings.triggers.dateFromChanged).toEqual(true);
        expect(settings.triggers.dateToChanged).toEqual(true);
        expect(settings.triggers.filterChanged).toEqual(true);
        expect(settings.triggers.queryChangeDelay).toEqual(2000);
        expect(settings.triggers.queryChangeInstantRegex).toEqual(/\S\s$/u);
        expect(settings.triggers.queryChange).toEqual(true);
        expect(settings.triggers.queryChangeMinLength).toEqual(2);
        expect(settings.triggers.searchTypeChanged).toEqual(true);
        expect(settings.triggers.uiLanguageCodeChanged).toEqual(true);
        expect(settings.url).toEqual(
            "http://dummy/RestService/v4/search/categorize"
        );
    });

    it("Should be possible to pass a CategoryPresentationMap object to use for values.", () => {
        let catPresMap: CategoryPresentationMap = {
            __ROOT__: {
                sorting: {
                    enabled: true,
                    parts: [
                        "System",
                        new SortPartConfiguration({ match: /File.*/ })
                    ],
                    uiHintShowFilterInputThreshold: 10
                } as SortingConfiguration
            } as CategoryPresentation,
            Author: {
                expanded: true,
                grouping: {
                    enabled: true,
                    pattern: /^(...)/,
                    minCount: 5,
                    mode: "DisplayName",
                    replacement: "$1"
                },
                filter: {
                    enabled: true,
                    match: /Hanssen/,
                    maxMatchCount: 100,
                    uiHintShowFilterInputThreshold: 10
                },
                sorting: {
                    enabled: true,
                    parts: [
                        "System",
                        new SortPartConfiguration({ match: /File.*/ })
                    ]
                },
                limit: {
                    enabled: true,
                    page: 2,
                    pageSize: 10,
                    uiHintShowPager: true
                }
            }
        } as CategoryPresentationMap;

        let settings = {
            baseUrl: "http://dummy",
            enabled: false,
            triggers: {
                clientIdChanged: false,
                matchGroupingChanged: false
            },
            presentations: catPresMap
        } as ICategorizeSettings;

        settings = new CategorizeSettings(settings);

        expect(settings).toBeDefined();
        expect(settings.presentations).toBeDefined();
        expect(settings.presentations.Author.filter.match).toBe(
            catPresMap.Author.filter.match
        );
        expect(settings.presentations.Author.sorting.parts[0]).toEqual(
            catPresMap.Author.sorting.parts[0]
        );
    });
});
