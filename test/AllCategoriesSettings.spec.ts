// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { AllCategoriesSettings } from '../src/AllCategories';
import { Categories } from '../src/Data';

describe("AutocompleteSettings basics", () => {

    it("Should be able to create a default settings object with expected values", () => {
        let settings = new AllCategoriesSettings();

        expect(settings).toBeDefined();
        expect(settings instanceof AllCategoriesSettings).toBeTruthy();
        expect (settings.enabled).toBeTruthy();
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeUndefined();
        expect (settings.url).toEqual("search/allcategories");
    });

    it("Should be poassible to pass in an AllCategoriesSettings object to use for values.", () => {
        let settings = {
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
            url: "/test/",
        } as AllCategoriesSettings;

        settings = new AllCategoriesSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AllCategoriesSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.url).toEqual("test");
    });

    it("Should be poassible to pass in an anonymous object to use for values.", () => {
        let settings = {
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
        };

        let resSettings = new AllCategoriesSettings(settings);

        expect(resSettings).toBeDefined();
        expect(resSettings instanceof AllCategoriesSettings).toBeTruthy();
        expect (resSettings.enabled).toBeFalsy();
        expect (resSettings.cbRequest).toBeDefined();
        expect (resSettings.cbError).toBeDefined();
        expect (resSettings.cbSuccess).toBeDefined();
        expect (resSettings.url).toEqual("search/allcategories");
    });

    it("Should be poassible to pass a partial AllCategoriesSettings object to use for values.", () => {
        let settings = {
            cbError: (error: any) => { /* dummy */},
            cbRequest: (url: string, reqInit: RequestInit) => { /* dummy */},
            cbSuccess: (data: Categories) => { /* dummy */},
            enabled: false,
        } as AllCategoriesSettings;

        settings = new AllCategoriesSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AllCategoriesSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.url).toEqual("search/allcategories");
    });

});
