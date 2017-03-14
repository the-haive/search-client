// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';

dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { Categories } from '../src/Data/Categories';
import { BestBets } from '../src/BestBets/BestBets';
import { BestBetsSettings } from '../src/BestBets/BestBetsSettings';

describe("BestBets basics", () => {

    it("Should have imported BestBets class defined", () => {
        expect(typeof BestBets).toBe("function");
    });

    it("Should be able to create BestBets instance", () => {
        let bestBets = new BestBets("http://localhost:9950");
        let pBestBets = <any> bestBets;

        expect(typeof bestBets).toBe("object");
        expect(bestBets instanceof BestBets).toBeTruthy();
        expect(pBestBets.settings.enabled).toEqual(true);
        expect(pBestBets.settings.cbError).toBeUndefined();
        expect(pBestBets.settings.cbRequest).toBeUndefined();
        expect(pBestBets.settings.cbSuccess).toBeUndefined();
        expect(pBestBets.settings.url).toEqual("/manage/bestbets");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let bestBets = new BestBets("file://localhost:9950");
        }).toThrow();

        expect(() => {
            let allCategories = new BestBets("http:+//localhost:9950");
        }).toThrow();
    });

    it("Should be able to create BestBets instance with default settings passed", () => {
        let bestBets = new BestBets("http://localhost:9950", new BestBetsSettings());
        let pBestBets = <any> bestBets;

        expect(typeof bestBets).toBe("object");
        expect(bestBets instanceof BestBets).toBeTruthy();
        expect(pBestBets.settings.enabled).toEqual(true);
        expect(pBestBets.settings.cbError).toBeUndefined();
        expect(pBestBets.settings.cbRequest).toBeUndefined();
        expect(pBestBets.settings.cbSuccess).toBeUndefined();
        expect(pBestBets.settings.url).toEqual("/manage/bestbets");
    });

    it("Should be able to create BestBets instance with newed settings passed", () => {
        let settings = new BestBetsSettings();
        settings.cbError = jest.fn();
        settings.cbRequest = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.url = "/test";
        let bestBets = new BestBets("http://localhost:9950", settings);
        let pBestBets = <any> bestBets;

        expect(pBestBets.settings.enabled).toEqual(settings.enabled);
        expect(pBestBets.settings.cbError).toEqual(settings.cbError);
        expect(pBestBets.settings.cbRequest).toEqual(settings.cbRequest);
        expect(pBestBets.settings.cbSuccess).toEqual(settings.cbSuccess);
        expect(pBestBets.settings.url).toEqual(settings.url);
    });

    it("Should be able to create BestBets instance with object settings passed", () => {
        const settings = {
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
            url: "/test",
        } as BestBetsSettings;
        let bestBets = new BestBets("http://localhost:9950", settings);
        let pBestBets = <any> bestBets;

        expect(pBestBets.settings.enabled).toEqual(settings.enabled);
        expect(pBestBets.settings.cbError).toEqual(settings.cbError);
        expect(pBestBets.settings.cbRequest).toEqual(settings.cbRequest);
        expect(pBestBets.settings.cbSuccess).toEqual(settings.cbSuccess);
        expect(pBestBets.settings.url).toEqual(settings.url);
    });

});
