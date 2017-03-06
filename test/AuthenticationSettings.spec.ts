// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { AuthenticationSettings } from '../src/Authentication';

describe("AutocompleteSettings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new AuthenticationSettings();

        expect(settings).toBeDefined();
        expect(settings instanceof AuthenticationSettings).toBeTruthy();
        expect (settings.enabled).toBeTruthy();
        expect (settings.cbBusy).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeUndefined();
        expect (settings.tokenPath).toContain("jwtToken");
        expect (settings.token).toBeUndefined();
        expect (settings.trigger.expiryOverlap).toEqual(60);
        expect (settings.url).toEqual("/auth/token");
    });

    it("Should be poassible to pass in an AuthenticationSettings object to use for values.", () => {
        let fnBusy = (isBusy: boolean, url: string, reqInit: RequestInit) => { /* dummy */};
        let fnError = (error: any) => { /* dummy */};
        let fnSuccess = (token: string) => { /* dummy */};

        let settings = {
            cbBusy: fnBusy,
            cbError: fnError,
            cbSuccess: fnSuccess,
            enabled: false,
            token: "test",
            tokenPath: ["jwt"],
            trigger: {
                expiryOverlap: 120,
            },
            url: "/test/",
        } as AuthenticationSettings;

        settings = new AuthenticationSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AuthenticationSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbBusy).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.tokenPath).toContain("jwt");
        expect (settings.token).toEqual("test");
        expect (settings.trigger.expiryOverlap).toEqual(120);
        expect (settings.url).toEqual("/test/");
    });

    it("Should be poassible to pass a partial AuthenticationSettings object to use for values.", () => {
        let fnBusy = (isBusy: boolean, url: string, reqInit: RequestInit) => { /* dummy */};
        let fnError = (error: any) => { /* dummy */};
        let fnSuccess = (token: string) => { /* dummy */};

        let settings = {
            cbBusy: fnBusy,
            cbError: fnError,
            cbSuccess: fnSuccess,
            token: "test",
            trigger: {},
        } as AuthenticationSettings;

        settings = new AuthenticationSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AuthenticationSettings).toBeTruthy();
        expect (settings.enabled).toBeTruthy();
        expect (settings.cbBusy).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.token).toEqual("test");
        expect (settings.tokenPath).toContain("jwtToken");
        expect (settings.trigger.expiryOverlap).toEqual(60);
        expect (settings.url).toEqual("/auth/token");
    });

});
