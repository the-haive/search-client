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
        expect (settings.url).toEqual("/manage/bestbets");
    });

    it("Should be poassible to pass in an BestBetsSettings object to use for values.", () => {
        let fnBusy = (isBusy: boolean, url: string, reqInit: RequestInit) => { /* dummy */};
        let fnError = (error: any) => { /* dummy */};
        let fnSuccess = (token: string) => { /* dummy */};

        let settings = {
            enabled: false,
            url: "/test/",
        } as BestBetsSettings;

        settings = new BestBetsSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof BestBetsSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.url).toEqual("/test/");
    });

    it("Should be poassible to pass a partial BestBetsSettings object to use for values.", () => {

        let settings = {
            enabled: false,
        } as BestBetsSettings;

        settings = new BestBetsSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof BestBetsSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.url).toEqual("/manage/bestbets");
    });

});
