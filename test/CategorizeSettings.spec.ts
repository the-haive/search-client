// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { CategorizeSettings } from '../src/Categorize';
import { Categories } from '../src/Data';

describe("CategorizeSettings basics", () => {

    it("uiLanguageCodeChanged default", () => {
        let settings = new CategorizeSettings();
        expect (settings.triggers.uiLanguageCodeChanged).toEqual(true);
    });

    it("uiLanguageCodeChanged true", () => {
        let settings = new CategorizeSettings({triggers: {uiLanguageCodeChanged: true}});
        expect (settings.triggers.uiLanguageCodeChanged).toEqual(true);
    });

    it("uiLanguageCodeChanged false", () => {
        let settings = new CategorizeSettings({triggers: {uiLanguageCodeChanged: false}});
        expect (settings.triggers.uiLanguageCodeChanged).toEqual(false);
    });
    
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new CategorizeSettings();

        expect(settings).toBeDefined();
        expect(settings instanceof CategorizeSettings).toBeTruthy();
        expect (settings.enabled).toBeTruthy();
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeUndefined();
        expect (settings.triggers.clientIdChanged).toEqual(true);
        expect (settings.triggers.dateFromChanged).toEqual(true);
        expect (settings.triggers.dateToChanged).toEqual(true);
        expect (settings.triggers.filterChanged).toEqual(true);
        expect (settings.triggers.queryChangeDelay).toEqual(-1);
        expect (settings.triggers.queryChangeInstantRegex).toEqual(/\S\n$/);
        expect (settings.triggers.queryChange).toEqual(true);
        expect (settings.triggers.queryChangeMinLength).toEqual(2);
        expect (settings.triggers.searchTypeChanged).toEqual(true);
        expect (settings.triggers.uiLanguageCodeChanged).toEqual(true);
        expect (settings.url).toEqual("search/categorize");
    });

    it("Should be poassible to pass in an CategorizeSettings object to use for values.", () => {
        let settings = {
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
                uiLanguageCodeChanged: false,
            },
            url: "/test/",
        } as CategorizeSettings;

        settings = new CategorizeSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof CategorizeSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.triggers.clientIdChanged).toEqual(false);
        expect (settings.triggers.dateFromChanged).toEqual(false);
        expect (settings.triggers.dateToChanged).toEqual(false);
        expect (settings.triggers.filterChanged).toEqual(false);
        expect (settings.triggers.queryChangeDelay).toEqual(100);
        expect (settings.triggers.queryChangeInstantRegex).toEqual(/\S/);
        expect (settings.triggers.queryChange).toEqual(true);
        expect (settings.triggers.queryChangeMinLength).toEqual(2);
        expect (settings.triggers.searchTypeChanged).toEqual(false);
        expect (settings.triggers.uiLanguageCodeChanged).toEqual(false);
        expect (settings.url).toEqual("test");
    });

    it("Should be poassible to pass a partial CategorizeSettings object to use for values.", () => {
        let settings = {
            cbSuccess: (categories: Categories) => { /* dummy */},
            enabled: false,
            triggers: {
                clientIdChanged: false,
            },
        } as CategorizeSettings;

        settings = new CategorizeSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof CategorizeSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.triggers.clientIdChanged).toEqual(false);
        expect (settings.triggers.dateFromChanged).toEqual(true);
        expect (settings.triggers.dateToChanged).toEqual(true);
        expect (settings.triggers.filterChanged).toEqual(true);
        expect (settings.triggers.queryChangeDelay).toEqual(-1);
        expect (settings.triggers.queryChangeInstantRegex).toEqual(/\S\n$/);
        expect (settings.triggers.queryChange).toEqual(true);
        expect (settings.triggers.queryChangeMinLength).toEqual(2);
        expect (settings.triggers.searchTypeChanged).toEqual(true);
        expect (settings.triggers.uiLanguageCodeChanged).toEqual(true);
        expect (settings.url).toEqual("search/categorize");
    });

    it("Should be poassible to pass a partial CategorizeSettings object to use for values.", () => {
        let settings = {
            cbSuccess: (categories: Categories) => { /* dummy */},
            enabled: false,
                triggers: {
                    queryChange: true,
                    queryChangeInstantRegex: /\S $/,
                },
        } as CategorizeSettings;

        settings = new CategorizeSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof CategorizeSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.triggers.queryChange).toEqual(true);
        expect (settings.triggers.queryChangeInstantRegex).toEqual(/\S $/);
        expect (settings.url).toEqual("search/categorize");
    });

});
