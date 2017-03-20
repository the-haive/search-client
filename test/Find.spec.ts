// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { Find } from '../src/Find';
import { FindSettings } from '../src/Find/FindSettings';
import { FindTriggers } from '../src/Find/FindTriggers';
import { Matches } from '../src/Data/Matches';

describe("Find basics", () => {

    it("Should have imported Find class defined", () => {
        expect(typeof Find).toBe("function");
    });

    it("Should be able to create Find instance", () => {
        let find = new Find("http://localhost:9950/");
        let pFind = <any> find;

        expect(typeof find).toBe("object");
        expect(find instanceof Find).toBeTruthy();
        expect(pFind.settings.enabled).toEqual(true);
        expect(pFind.settings.cbError).toBeUndefined();
        expect(pFind.settings.cbRequest).toBeUndefined();
        expect(pFind.settings.cbSuccess).toBeUndefined();
        expect(pFind.settings.triggers).toBeDefined();
        expect(pFind.settings.triggers.filterChanged).toEqual(true);
        expect(pFind.settings.url).toEqual("search/find");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let find = new Find("file://localhost:9950");
        }).toThrow();

        expect(() => {
            let find = new Find("http:+//localhost:9950");
        }).toThrow();
    });

    it("Should be able to pass a default FindSettings instance", () => {
        let find = new Find("http://localhost:9950/", new FindSettings());
        let pFind = <any> find;

        expect(typeof pFind.auth).toBe("object");
        expect(pFind.settings.enabled).toEqual(true);
        expect(pFind.settings.cbError).toBeUndefined();
        expect(pFind.settings.cbRequest).toBeUndefined();
        expect(pFind.settings.cbSuccess).toBeUndefined();
        expect(pFind.settings.triggers).toBeDefined();
        expect(pFind.settings.triggers.filterChanged).toEqual(true);
        expect(pFind.settings.url).toEqual("search/find");
    });

    it("Should be able to pass an FindSettings instance with additional settings", () => {
        let settings = new FindSettings();
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.triggers = new FindTriggers();
        settings.url = "/test";

        let find = new Find("http://localhost:9950/", settings);
        let pFind = <any> find;

        expect(typeof pFind.auth).toBe("object");
        expect(find.baseUrl).toEqual("http://localhost:9950/RestService/v3");
        expect(pFind.settings.enabled).toEqual(false);
        expect(pFind.settings.cbError).toBeDefined();
        expect(pFind.settings.cbRequest).toBeUndefined();
        expect(pFind.settings.cbSuccess).toBeDefined();
        expect(pFind.settings.triggers).toBeDefined();
        expect(pFind.settings.triggers.filterChanged).toEqual(true);
        expect(pFind.settings.url).toEqual("test");
    });

    it("Should be able to pass a manual object settings as FindSettings", () => {
        let settings = {
            cbError: (error: any) => { /* dummy */},
            cbSuccess: (data: Matches) => { /* dummy */},
            enabled: false,
            triggers: new FindTriggers(),
            url: "/test",
        } as FindSettings;

        let find = new Find("http://localhost:9950/", settings);
        let pFind = <any> find;

        expect(typeof pFind.auth).toBe("object");
        expect(find.baseUrl).toEqual("http://localhost:9950/RestService/v3");
        expect(pFind.settings.enabled).toEqual(false);
        expect(pFind.settings.cbError).toBeDefined();
        expect(pFind.settings.cbRequest).toBeUndefined();
        expect(pFind.settings.cbSuccess).toBeDefined();
        expect(pFind.settings.triggers).toBeDefined();
        expect(pFind.settings.triggers.filterChanged).toEqual(true);
        expect(pFind.settings.url).toEqual("test");
    });

});
