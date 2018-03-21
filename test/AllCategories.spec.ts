// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';
dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { Categories } from '../src/Data/Categories';
import { AllCategories } from '../src/AllCategories';
import { AllCategoriesSettings } from '../src/AllCategories/AllCategoriesSettings';

describe("AllCategories basics", () => {

    it("Should have imported AllCategories class defined", () => {
        expect(typeof AllCategories).toBe("function");
    });

    it("Should be able to create default AllCategories instance", () => {
        let allCategories = new AllCategories("http://localhost:9950/");
        let pAllCategories = <any> allCategories;

        expect(typeof allCategories).toBe("object");
        expect(allCategories instanceof AllCategories).toBeTruthy();
        expect(pAllCategories.settings.enabled).toEqual(true);
        expect(pAllCategories.settings.cbError).toBeUndefined();
        expect(pAllCategories.settings.cbRequest).toBeUndefined();
        expect(pAllCategories.settings.cbSuccess).toBeUndefined();
        expect(pAllCategories.settings.url).toEqual("search/allcategories");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let allCategories = new AllCategories("file://localhost:9950");
        }).toThrow();

        expect(() => {
            let allCategories = new AllCategories("http:+//localhost:9950");
        }).toThrow();
    });

    it("Should be able to create AllCategories instance with default settings passed", () => {
        let allCategories = new AllCategories("http://localhost:9950/", new AllCategoriesSettings());
        let pAllCategories = <any> allCategories;

        expect(pAllCategories.settings.enabled).toEqual(true);
        expect(pAllCategories.settings.cbError).toBeUndefined();
        expect(pAllCategories.settings.cbRequest).toBeUndefined();
        expect(pAllCategories.settings.cbSuccess).toBeUndefined();
        expect(pAllCategories.settings.url).toEqual("search/allcategories");
    });

    it("Should be able to create AllCategories instance with newed settings passed", () => {
        let settings = new AllCategoriesSettings();
        settings.cbError = jest.fn();
        settings.cbRequest = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        let allCategories = new AllCategories("http://localhost:9950/", settings);
        let pAllCategories = <any> allCategories;

        expect(pAllCategories.settings.enabled).toEqual(settings.enabled);
        expect(pAllCategories.settings.cbError).toEqual(settings.cbError);
        expect(pAllCategories.settings.cbRequest).toEqual(settings.cbRequest);
        expect(pAllCategories.settings.cbSuccess).toEqual(settings.cbSuccess);
        expect(pAllCategories.settings.url).toEqual("search/allcategories");
    });

    it("Should be able to create AllCategories instance with custom url", () => {
        let settings = new AllCategoriesSettings();
        settings.cbError = jest.fn();
        settings.cbRequest = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.url = "/test";
        let allCategories = new AllCategories("http://localhost:9950/", settings);
        let pAllCategories = <any> allCategories;

        expect(pAllCategories.settings.enabled).toEqual(settings.enabled);
        expect(pAllCategories.settings.cbError).toEqual(settings.cbError);
        expect(pAllCategories.settings.cbRequest).toEqual(settings.cbRequest);
        expect(pAllCategories.settings.cbSuccess).toEqual(settings.cbSuccess);
        expect(pAllCategories.settings.url).toEqual("test");
    });

    it("Should be able to pass object settings as AllCategoriesSettings", () => {
        let actualUrl: string;
        const settings = {
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url;
            }),
            cbSuccess: jest.fn(),
        } as AllCategoriesSettings;
        let allCategories = new AllCategories("http://localhost:9950/", settings);
        let pAllCategories = <any> allCategories;

        expect(pAllCategories.settings).toBeDefined();
        expect(pAllCategories.settings.enabled).toEqual(true);
        expect(pAllCategories.baseUrl).toEqual("http://localhost:9950/RestService/v4");
        expect(pAllCategories.settings.cbRequest).toBeDefined();
        expect(pAllCategories.settings.cbSuccess).toBeDefined();
        expect(pAllCategories.settings.url).toEqual("search/allcategories");
        
        allCategories.fetch();
        expect(settings.cbRequest).toHaveBeenCalled();
        expect(actualUrl).toEqual("http://localhost:9950/RestService/v4/search/allcategories");
    });

    it("Should be able to pass new AllCategoriesSettings object", () => {
        let actualUrl: string;
        let settings = new AllCategoriesSettings({
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url;
            }),
            cbSuccess: jest.fn(),
        });

        let allCategories = new AllCategories("http://localhost:9950/", settings);
        let pAllCategories = <any> allCategories;
        
        expect(pAllCategories.settings).toBeDefined();
        expect(pAllCategories.settings.enabled).toEqual(true);
        expect(pAllCategories.baseUrl).toEqual("http://localhost:9950/RestService/v4");
        expect(pAllCategories.settings.cbRequest).toBeDefined();
        expect(pAllCategories.settings.cbSuccess).toBeDefined();
        expect(pAllCategories.settings.url).toEqual("search/allcategories");
        
        allCategories.fetch();
        expect(settings.cbRequest).toHaveBeenCalled();
        expect(actualUrl).toEqual("http://localhost:9950/RestService/v4/search/allcategories");
    });

    it("Should be able to pass anonymous object settings", () => {
        let actualUrl: string;
        let settings = {
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url;
            }),
            cbSuccess: jest.fn(),
        };

        let allCategories = new AllCategories("http://localhost:9950/", settings);
        let pAllCategories = <any> allCategories;

        expect(pAllCategories.settings).toBeDefined();
        expect(pAllCategories.settings.enabled).toEqual(true);
        expect(pAllCategories.baseUrl).toEqual("http://localhost:9950/RestService/v4");
        expect(pAllCategories.settings.cbRequest).toBeDefined();
        expect(pAllCategories.settings.cbSuccess).toBeDefined();
        expect(pAllCategories.settings.url).toEqual("search/allcategories");
        
        allCategories.fetch();
        expect(settings.cbRequest).toHaveBeenCalled();
        expect(actualUrl).toEqual("http://localhost:9950/RestService/v4/search/allcategories");
    });

});
