// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { BestBetsSettings } from '../src/BestBets';

describe("BestBetsSettings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new BestBetsSettings();

        expect(settings).toBeDefined();
        expect(settings instanceof BestBetsSettings).toBeTruthy();
        expect (settings.enabled).toBeTruthy();
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeUndefined();
        expect (settings.url).toEqual("/manage/bestbets");
    });

    it("Should be poassible to pass in an BestBetsSettings object to use for values.", () => {
        let settings = {
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
            url: "/test/",
        } as BestBetsSettings;

        settings = new BestBetsSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof BestBetsSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.url).toEqual("/test/");
    });

    it("Should be poassible to pass a partial BestBetsSettings object to use for values.", () => {

        let settings = {
            cbError: (error: any) => { /* dummy */},
            cbRequest: (url: string, reqInit: RequestInit) => { /* dummy */},
            cbSuccess: (data: string[]) => { /* dummy */},
            enabled: false,
        } as BestBetsSettings;

        settings = new BestBetsSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof BestBetsSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.url).toEqual("/manage/bestbets");
    });

});
