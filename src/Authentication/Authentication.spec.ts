import * as jwt from "jwt-simple";

import { Authentication } from "./Authentication";
import {
    AuthenticationSettings,
    IAuthenticationSettings
} from "./AuthenticationSettings";
import { AuthenticationTriggers } from "./AuthenticationTriggers";

describe("Authentication basics", () => {
    it("Should have imported Authentication class defined", () => {
        expect(typeof Authentication).toBe("function");
    });

    it("Should be able to create Authentication instance", () => {
        let authentication = new Authentication("http://localhost:9950/");
        let pAuthentication = authentication as any;

        expect(typeof authentication).toBe("object");
        expect(authentication instanceof Authentication).toBeTruthy();
        expect(pAuthentication.settings.baseUrl).toEqual(
            "http://localhost:9950"
        );
        let settings = pAuthentication.settings as IAuthenticationSettings;
        expect(settings).toBeDefined();
        expect(settings.enabled).toBeFalsy();
        expect(settings.basePath).toEqual("");
        expect(settings.servicePath).toEqual("auth/login");
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
        expect(settings.token).toBeUndefined();
        expect(settings.tokenPath).toContain("jwtToken");
        expect(settings.triggers).toBeDefined();
        expect(settings.triggers.expiryOverlap).toEqual(60);
        expect(pAuthentication.auth.authenticationToken).toBeUndefined();
        expect(settings.url).toEqual("http://localhost:9950/auth/login");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let authentication = new Authentication("file://localhost:9950");
            expect(typeof authentication).toBe("object");
        }).not.toThrow();

        expect(() => {
            let authentication = new Authentication("http:+//localhost:9950");
            expect(typeof authentication).toBe("object");
        }).not.toThrow();
    });

    it("Should be able to pass a default AuthenticationSettings instance", () => {
        const authSettings = {} as IAuthenticationSettings;
        authSettings.baseUrl = "http://localhost:9950/";
        let authentication = new Authentication(authSettings);
        let pAuthentication = authentication as any;

        expect(typeof pAuthentication.auth).toBe("object");
        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toBeFalsy();
        expect(pAuthentication.settings.cbError).toBeUndefined();
        expect(pAuthentication.settings.cbRequest).toBeUndefined();
        expect(pAuthentication.settings.cbSuccess).toBeUndefined();
        expect(pAuthentication.settings.token).toBeUndefined();
        expect(pAuthentication.settings.tokenPath).toContain("jwtToken");
        expect(pAuthentication.settings.triggers).toBeDefined();
        expect(pAuthentication.settings.triggers.expiryOverlap).toEqual(60);
        expect(pAuthentication.auth.authenticationToken).toBeUndefined();
        expect(pAuthentication.settings.url).toEqual(
            "http://localhost:9950/auth/login"
        );
    });

    it("Should be able to pass an AuthenticationSettings instance with additional settings", () => {
        const token = jwt.encode({ test: "test" }, "test");
        let settings = new AuthenticationSettings("http://dummy");
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.token = token;
        settings.tokenPath = [];
        settings.triggers = new AuthenticationTriggers();
        settings.basePath = "/test";

        let authentication = new Authentication(settings);
        let pAuthentication = authentication as any;

        expect(typeof pAuthentication.auth).toBe("object");
        expect(pAuthentication.settings.baseUrl).toEqual("http://dummy");
        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toEqual(false);
        expect(pAuthentication.settings.cbError).toBeDefined();
        expect(pAuthentication.settings.cbRequest).toBeUndefined();
        expect(pAuthentication.settings.cbSuccess).toBeDefined();
        expect(pAuthentication.settings.token).toBeUndefined();
        expect(pAuthentication.settings.tokenPath).toHaveLength(0);
        expect(pAuthentication.settings.triggers).toBeDefined();
        expect(pAuthentication.settings.triggers.expiryOverlap).toEqual(60);
        expect(pAuthentication.settings.token).toBeUndefined();
        expect(pAuthentication.auth.authenticationToken).toEqual(token);
        expect(pAuthentication.settings.url).toEqual(
            "http://dummy/test/auth/login"
        );
    });

    it("Should be able to pass a manual object settings as AuthenticationSettings", () => {
        const jwtToken = jwt.encode({ test: "test" }, "test");
        let settings = {
            baseUrl: "http://localhost:9950",
            cbError: (error: any) => {
                /* dummy */
            },
            cbRequest: (url: string, reqInit: RequestInit) => false,
            cbSuccess: (token: string) => {
                /* dummy */
            },
            enabled: false,
            token: jwtToken,
            tokenPath: [],
            triggers: new AuthenticationTriggers(),
            basePath: "/test"
        } as AuthenticationSettings;

        let authentication = new Authentication(settings);
        let pAuthentication = authentication as any;

        expect(typeof pAuthentication.auth).toBe("object");
        expect(pAuthentication.settings.baseUrl).toEqual(
            "http://localhost:9950"
        );
        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toEqual(false);
        expect(pAuthentication.settings.cbError).toBeDefined();
        expect(pAuthentication.settings.cbRequest).toBeDefined();
        expect(pAuthentication.settings.cbSuccess).toBeDefined();
        expect(pAuthentication.settings.token).toBeUndefined();
        expect(pAuthentication.settings.tokenPath).toHaveLength(0);
        expect(pAuthentication.settings.triggers).toBeDefined();
        expect(pAuthentication.settings.triggers.expiryOverlap).toEqual(60);
        expect(pAuthentication.settings.token).toBeUndefined();
        expect(pAuthentication.auth.authenticationToken).toEqual(jwtToken);
        expect(pAuthentication.settings.url).toEqual(
            "http://localhost:9950/test/auth/login"
        );
    });

    it("Should be able to pass object settings as AuthenticationSettings", () => {
        let actualUrl: string;
        const settings = {
            baseUrl: "http://localhost:9950/",
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url;
                return false;
            }),
            cbSuccess: jest.fn()
        } as IAuthenticationSettings;
        let authentication = new Authentication(settings);
        let pAuthentication = authentication as any;

        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toBeFalsy();
        expect(pAuthentication.settings.baseUrl).toEqual(
            "http://localhost:9950"
        );
        expect(pAuthentication.settings.cbRequest).toBeDefined();
        expect(pAuthentication.settings.cbSuccess).toBeDefined();
        expect(pAuthentication.settings.url).toEqual(
            "http://localhost:9950/auth/login"
        );

        authentication
            .fetch()
            .then(response => {
                expect(response).toBeNull();
            })
            .catch(error => {
                fail("Did not expect to throw error");
            });

        expect(settings.cbRequest).toHaveBeenCalled();
        expect(actualUrl).toEqual("http://localhost:9950/auth/login");
    });

    it("Should be able to pass new AuthenticationSettings object", () => {
        let actualUrl: string;
        let settings = new AuthenticationSettings({
            baseUrl: "http://localhost:9950/",
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url;
                return false;
            }),
            cbSuccess: jest.fn()
        });

        let authentication = new Authentication(settings);
        let pAuthentication = authentication as any;

        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toBeFalsy();
        expect(pAuthentication.settings.baseUrl).toEqual(
            "http://localhost:9950"
        );
        expect(pAuthentication.settings.cbRequest).toBeDefined();
        expect(pAuthentication.settings.cbSuccess).toBeDefined();
        expect(pAuthentication.settings.url).toEqual(
            "http://localhost:9950/auth/login"
        );

        authentication
            .fetch()
            .then(response => {
                expect(response).toBeNull();
            })
            .catch(error => {
                fail("Did not expect to throw error");
            });
        expect(settings.cbRequest).toHaveBeenCalled();
        expect(actualUrl).toEqual("http://localhost:9950/auth/login");
    });

    it("Should be able to pass anonymous object settings", () => {
        let actualUrl: string;
        let settings = {
            baseUrl: "http://localhost:9950/",
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url;
                return false;
            }),
            cbSuccess: jest.fn()
        };

        let authentication = new Authentication(settings);
        let pAuthentication = authentication as any;

        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toBeFalsy();
        expect(pAuthentication.settings.baseUrl).toEqual(
            "http://localhost:9950"
        );
        expect(pAuthentication.settings.cbRequest).toBeDefined();
        expect(pAuthentication.settings.cbSuccess).toBeDefined();
        expect(pAuthentication.settings.url).toEqual(
            "http://localhost:9950/auth/login"
        );

        authentication
            .fetch()
            .then(response => {
                expect(response).toBeNull();
            })
            .catch(error => {
                fail("Did not expect to throw error");
            });
        expect(settings.cbRequest).toHaveBeenCalled();
        expect(actualUrl).toEqual("http://localhost:9950/auth/login");
    });

    it("Should call refresh for auth-token", () => {
        let now = new Date().valueOf() / 1000;
        let exp = now + 15 * 60; // Expires in 15 minutes
        let payload = { exp };

        let settings = {
            baseUrl: "http://localhost:9950/",
            token: jwt.encode(payload, "test"),
            triggers: {
                expiryOverlap: 15
            }
        } as AuthenticationSettings;

        let decoded = jwt.decode(settings.token, null, true);
        expect(decoded.exp).toEqual(payload.exp);

        settings.cbRequest = jest.fn(() => {
            // Block executing the fetch call
            return false;
        });

        jest.useFakeTimers();

        let authentication = new Authentication(settings);
        let pAuthentication = authentication as any;
        jest.runAllTimers();
        expect(typeof pAuthentication.auth).toBe("object");
        expect(pAuthentication.settings.cbRequest).toEqual(settings.cbRequest);
        expect(settings.cbRequest).toBeCalled();
        expect((setTimeout as any).mock.calls.length).toBe(1);
        expect((setTimeout as any).mock.calls[0][1]).toBeGreaterThan(850);
    });
});
