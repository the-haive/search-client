// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { Categorize } from '../src/Categorize';
import { CategorizeSettings } from '../src/Categorize/CategorizeSettings';
import { CategorizeTrigger } from '../src/Categorize/CategorizeTrigger';
import { Categories } from '../src/Data/Categories';

describe("Categorize basics", () => {

    it("Should have imported Categorize class defined", () => {
        expect(typeof Categorize).toBe("function");
    });

    it("Should be able to create Categorize instance", () => {
        let categorize = new Categorize("http://localhost:9950/RestService/v3/");
        let pCategorize = <any> categorize;

        expect(typeof categorize).toBe("object");
        expect(categorize instanceof Categorize).toBeTruthy();
        expect(pCategorize.settings.enabled).toEqual(true);
        expect(pCategorize.settings.cbError).toBeUndefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeUndefined();
        expect(pCategorize.settings.trigger).toBeDefined();
        expect(pCategorize.settings.trigger.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("/search/categorize");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let categorize = new Categorize("file://localhost:9950/RestService/v3/");
        }).toThrow();

        expect(() => {
            let categorize = new Categorize("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

    it("Should be able to pass a default CategorizeSettings instance", () => {
        let categorize = new Categorize("http://localhost:9950/RestService/v3/", new CategorizeSettings());
        let pCategorize = <any> categorize;

        expect(typeof pCategorize.auth).toBe("object");
        expect(pCategorize.settings.enabled).toEqual(true);
        expect(pCategorize.settings.cbError).toBeUndefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeUndefined();
        expect(pCategorize.settings.trigger).toBeDefined();
        expect(pCategorize.settings.trigger.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("/search/categorize");
    });

    it("Should be able to pass an CategorizeSettings instance with additional settings", () => {
        let settings = new CategorizeSettings();
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.trigger = new CategorizeTrigger();
        settings.url = "/test";

        let categorize = new Categorize("http://localhost:9950/RestService/v3/", settings);
        let pCategorize = <any> categorize;

        expect(typeof pCategorize.auth).toBe("object");
        expect(categorize.baseUrl).toEqual("http://localhost:9950/RestService/v3");
        expect(pCategorize.settings.enabled).toEqual(false);
        expect(pCategorize.settings.cbError).toBeDefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeDefined();
        expect(pCategorize.settings.trigger).toBeDefined();
        expect(pCategorize.settings.trigger.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("/test");
    });

    it("Should be able to pass a manual object settings as CategorizeSettings", () => {
        let settings = {
            cbError: (error: any) => { /* dummy */},
            cbSuccess: (data: Categories) => { /* dummy */},
            enabled: false,
            trigger: new CategorizeTrigger(),
            url: "/test",
        } as CategorizeSettings;

        let categorize = new Categorize("http://localhost:9950/RestService/v3/", settings);
        let pCategorize = <any> categorize;

        expect(typeof pCategorize.auth).toBe("object");
        expect(categorize.baseUrl).toEqual("http://localhost:9950/RestService/v3");
        expect(pCategorize.settings.enabled).toEqual(false);
        expect(pCategorize.settings.cbError).toBeDefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeDefined();
        expect(pCategorize.settings.trigger).toBeDefined();
        expect(pCategorize.settings.trigger.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("/test");
    });

});
