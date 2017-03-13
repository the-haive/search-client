// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { Categories } from '../src/Data/Categories';
import { AllCategories } from '../src/AllCategories';
import { AllCategoriesSettings } from '../src/AllCategories/AllCategoriesSettings';

describe("AllCategories basics", () => {

    it("Should have imported AllCategories class defined", () => {
        expect(typeof AllCategories).toBe("function");
    });

    it("Should be able to create default AllCategories instance", () => {
        let allCategories = new AllCategories("http://localhost:9950/RestService/v3/");
        let pAllCategories = <any> allCategories;

        expect(typeof allCategories).toBe("object");
        expect(allCategories instanceof AllCategories).toBeTruthy();
        expect(pAllCategories.settings.enabled).toEqual(true);
        expect(pAllCategories.settings.cbError).toBeUndefined();
        expect(pAllCategories.settings.cbRequest).toBeUndefined();
        expect(pAllCategories.settings.cbSuccess).toBeUndefined();
        expect(pAllCategories.settings.url).toEqual("/search/allcategories");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let allCategories = new AllCategories("file://localhost:9950/RestService/v3/");
        }).toThrow();

        expect(() => {
            let allCategories = new AllCategories("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

    it("Should be able to create AllCategories instance with default settings passed", () => {
        let allCategories = new AllCategories("http://localhost:9950/RestService/v3/", new AllCategoriesSettings());
        let pAllCategories = <any> allCategories;

        expect(pAllCategories.settings.enabled).toEqual(true);
        expect(pAllCategories.settings.cbError).toBeUndefined();
        expect(pAllCategories.settings.cbRequest).toBeUndefined();
        expect(pAllCategories.settings.cbSuccess).toBeUndefined();
        expect(pAllCategories.settings.url).toEqual("/search/allcategories");
    });

    it("Should be able to create AllCategories instance with newed settings passed", () => {
        let settings = new AllCategoriesSettings();
        settings.cbError = jest.fn();
        settings.cbRequest = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.url = "/test";
        let allCategories = new AllCategories("http://localhost:9950/RestService/v3/", settings);
        let pAllCategories = <any> allCategories;

        expect(pAllCategories.settings.enabled).toEqual(settings.enabled);
        expect(pAllCategories.settings.cbError).toEqual(settings.cbError);
        expect(pAllCategories.settings.cbRequest).toEqual(settings.cbRequest);
        expect(pAllCategories.settings.cbSuccess).toEqual(settings.cbSuccess);
        expect(pAllCategories.settings.url).toEqual(settings.url);
    });

    it("Should be able to create AllCategories instance with object settings passed", () => {
        const settings = {
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
            url: "/test",
        } as AllCategoriesSettings;
        let allCategories = new AllCategories("http://localhost:9950/RestService/v3/", settings);
        let pAllCategories = <any> allCategories;

        expect(pAllCategories.settings.enabled).toEqual(settings.enabled);
        expect(pAllCategories.settings.cbError).toEqual(settings.cbError);
        expect(pAllCategories.settings.cbRequest).toEqual(settings.cbRequest);
        expect(pAllCategories.settings.cbSuccess).toEqual(settings.cbSuccess);
        expect(pAllCategories.settings.url).toEqual(settings.url);
    });

});
