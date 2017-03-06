// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { AllCategoriesSettings } from '../src/AllCategories';

describe("AutocompleteSettings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new AllCategoriesSettings();

        expect(settings).toBeDefined();
        expect(settings instanceof AllCategoriesSettings).toBeTruthy();
        expect (settings.enabled).toBeTruthy();
        expect (settings.url).toEqual("/search/allcategories");
    });

    it("Should be poassible to pass in an AllCategoriesSettings object to use for values.", () => {
        let settings = {
            enabled: false,
            url: "/test/",
        } as AllCategoriesSettings;

        settings = new AllCategoriesSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AllCategoriesSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.url).toEqual("/test/");
    });

    it("Should be poassible to pass a partial AllCategoriesSettings object to use for values.", () => {
        let fnBusy = (isBusy: boolean, url: string, reqInit: RequestInit) => { /* dummy */};
        let fnError = (error: any) => { /* dummy */};
        let fnSuccess = (token: string) => { /* dummy */};

        let settings = {
            enabled: false,
        } as AllCategoriesSettings;

        settings = new AllCategoriesSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AllCategoriesSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.url).toEqual("/search/allcategories");
    });

});
