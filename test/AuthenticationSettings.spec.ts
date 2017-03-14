import * as jwt from 'jwt-simple';

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
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeUndefined();
        expect (settings.tokenPath).toContain("jwtToken");
        expect (settings.token).toBeUndefined();
        expect (settings.triggers.expiryOverlap).toEqual(60);
        expect (settings.url).toEqual("/auth/token");
    });

    it("Should be poassible to pass in an AuthenticationSettings object to use for values.", () => {
        const token = jwt.encode({test: "test"}, "test");
        let settings = {
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
            token,
            tokenPath: ["jwt"],
            triggers: {
                expiryOverlap: 120,
            },
            url: "/test/",
        } as AuthenticationSettings;

        settings = new AuthenticationSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AuthenticationSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.tokenPath).toContain("jwt");
        expect (settings.token).toEqual(token);
        expect (settings.triggers.expiryOverlap).toEqual(120);
        expect (settings.url).toEqual("/test/");
    });

    it("Should be poassible to pass a partial AuthenticationSettings object to use for values.", () => {
        const jwtToken = jwt.encode({test: "test"}, "test");
        let settings = {
            cbError: (error: any) => { /* dummy */},
            cbSuccess: (token: string) => { /* dummy */},
            token: jwtToken,
            triggers: {},
        } as AuthenticationSettings;

        settings = new AuthenticationSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AuthenticationSettings).toBeTruthy();
        expect (settings.enabled).toBeTruthy();
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.token).toEqual(jwtToken);
        expect (settings.tokenPath).toContain("jwtToken");
        expect (settings.triggers.expiryOverlap).toEqual(60);
        expect (settings.url).toEqual("/auth/token");
    });

});
