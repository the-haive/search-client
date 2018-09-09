import * as jwt from "jwt-simple";

import {
    AuthenticationSettings,
    IAuthenticationSettings
} from "./AuthenticationSettings";

describe("AutocompleteSettings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new AuthenticationSettings("http://dummy");

        expect(settings).toBeDefined();
        expect(settings instanceof AuthenticationSettings).toBeTruthy();
        expect(settings.enabled).toBeFalsy();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
        expect(settings.tokenPath).toContain("jwtToken");
        expect(settings.token).toBeUndefined();
        expect(settings.triggers.expiryOverlap).toEqual(60);
        expect(settings.url).toEqual("http://dummy/auth/login");
    });

    it("Should be possible to pass in an AuthenticationSettings object to use for values.", () => {
        const token = jwt.encode({ test: "test" }, "test");
        let settings = {
            baseUrl: "http://dummy",
            cbError: jest.fn(),
            cbRequest: jest.fn(() => {
                return false;
            }),
            cbSuccess: jest.fn(),
            enabled: true,
            token,
            tokenPath: ["jwt"],
            triggers: {
                expiryOverlap: 120
            },
            basePath: "/test/"
        } as IAuthenticationSettings;

        settings = new AuthenticationSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AuthenticationSettings).toBeTruthy();
        expect(settings.enabled).toBeTruthy();
        expect(settings.cbRequest).toBeDefined();
        expect(settings.cbError).toBeDefined();
        expect(settings.cbSuccess).toBeDefined();
        expect(settings.tokenPath).toContain("jwt");
        expect(settings.token).toEqual(token);
        expect(settings.triggers.expiryOverlap).toEqual(120);
        expect(settings.url).toEqual("http://dummy/test/auth/login");
    });

    it("Should be possible to pass a partial AuthenticationSettings object to use for values.", () => {
        const jwtToken = jwt.encode({ test: "test" }, "test");
        let settings = {
            baseUrl: "http://dummy",
            cbError: (error: any) => {
                /* dummy */
            },
            cbSuccess: (token: string) => {
                /* dummy */
            },
            token: jwtToken,
            triggers: {}
        } as IAuthenticationSettings;

        settings = new AuthenticationSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof AuthenticationSettings).toBeTruthy();
        expect(settings.enabled).toBeFalsy();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbError).toBeDefined();
        expect(settings.cbSuccess).toBeDefined();
        expect(settings.token).toEqual(jwtToken);
        expect(settings.tokenPath).toContain("jwtToken");
        expect(settings.triggers.expiryOverlap).toEqual(60);
        expect(settings.url).toEqual("http://dummy/auth/login");
    });
});
