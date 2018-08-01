import * as jwt from 'jwt-simple';

// tslint:disable-next-line:no-var-requires
// require("babel-core/register");
// require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
// import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';
// dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { Authentication } from './Authentication';
import { AuthenticationSettings } from './AuthenticationSettings';
import { AuthenticationTriggers } from './AuthenticationTriggers';

describe('Authentication basics', () => {

    it('Should have imported Authentication class defined', () => {
        expect(typeof Authentication).toBe('function');
    });

    it('Should be able to create Authentication instance', () => {
        let authentication = new Authentication('http://localhost:9950/');
        let pAuthentication = authentication as any;

        expect(typeof authentication).toBe('object');
        expect(authentication instanceof Authentication).toBeTruthy();
        expect(authentication.baseUrl).toEqual('http://localhost:9950/RestService/v4');
        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toBeFalsy();
        expect(pAuthentication.settings.cbError).toBeUndefined();
        expect(pAuthentication.settings.cbRequest).toBeUndefined();
        expect(pAuthentication.settings.cbSuccess).toBeUndefined();
        expect(pAuthentication.settings.token).toBeUndefined();
        expect(pAuthentication.settings.tokenPath).toContain('jwtToken');
        expect(pAuthentication.settings.triggers).toBeDefined();
        expect(pAuthentication.settings.triggers.expiryOverlap).toEqual(60);
        expect(pAuthentication.auth.authenticationToken).toBeUndefined();
        expect(pAuthentication.settings.url).toEqual('auth/token');
    });

    it('Should throw for invalid Urls', () => {
        expect(() => {
            let authentication = new Authentication('file://localhost:9950');
            expect(typeof authentication).toBeInstanceOf(Authentication);
        }).toThrow();

        expect(() => {
            let authentication = new Authentication('http:+//localhost:9950');
            expect(typeof authentication).toBeInstanceOf(Authentication);
        }).toThrow();
    });

    it('Should be able to pass a default AuthenticationSettings instance', () => {
        const authSettings = new AuthenticationSettings();
        let authentication = new Authentication('http://localhost:9950/', authSettings);
        let pAuthentication = authentication as any;

        expect(typeof pAuthentication.auth).toBe('object');
        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toBeFalsy();
        expect(pAuthentication.settings.cbError).toBeUndefined();
        expect(pAuthentication.settings.cbRequest).toBeUndefined();
        expect(pAuthentication.settings.cbSuccess).toBeUndefined();
        expect(pAuthentication.settings.token).toBeUndefined();
        expect(pAuthentication.settings.tokenPath).toContain('jwtToken');
        expect(pAuthentication.settings.triggers).toBeDefined();
        expect(pAuthentication.settings.triggers.expiryOverlap).toEqual(60);
        expect(pAuthentication.auth.authenticationToken).toBeUndefined();
        expect(pAuthentication.settings.url).toEqual('auth/token');
    });

    it('Should be able to pass an AuthenticationSettings instance with additional settings', () => {
        const token = jwt.encode({test: 'test'}, 'test');
        let settings = new AuthenticationSettings();
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.token = token;
        settings.tokenPath = [];
        settings.triggers = new AuthenticationTriggers();
        settings.url = '/test';
        console.log(`settings.tokenPath: ${settings.tokenPath}` );

        let authentication = new Authentication('http://localhost:9950/', settings);
        let pAuthentication = authentication as any;

        expect(typeof pAuthentication.auth).toBe('object');
        expect(authentication.baseUrl).toEqual('http://localhost:9950/RestService/v4');
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
        expect(pAuthentication.settings.url).toEqual('test');
    });

    it('Should be able to pass a manual object settings as AuthenticationSettings', () => {
        const jwtToken = jwt.encode({test: 'test'}, 'test');
        let settings = {
            cbError: (error: any) => { /* dummy */},
            cbRequest: (url: string, reqInit: RequestInit) => false,
            cbSuccess: (token: string) => { /* dummy */},
            enabled: false,
            token: jwtToken,
            tokenPath: [],
            triggers: new AuthenticationTriggers(),
            url: '/test',
        } as AuthenticationSettings;

        let authentication = new Authentication('http://localhost:9950/', settings);
        let pAuthentication = authentication as any;

        expect(typeof pAuthentication.auth).toBe('object');
        expect(authentication.baseUrl).toEqual('http://localhost:9950/RestService/v4');
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
        expect(pAuthentication.settings.url).toEqual('test');
    });

    it('Should be able to pass object settings as AuthenticationSettings', () => {
        let actualUrl: string;
        const settings = {
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url;
                return false;
            }),
            cbSuccess: jest.fn(),
        } as AuthenticationSettings;
        let authentication = new Authentication('http://localhost:9950/', settings);
        let pAuthentication = authentication as any;

        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toBeFalsy();
        expect(pAuthentication.baseUrl).toEqual('http://localhost:9950/RestService/v4');
        expect(pAuthentication.settings.cbRequest).toBeDefined();
        expect(pAuthentication.settings.cbSuccess).toBeDefined();
        expect(pAuthentication.settings.url).toEqual('auth/token');

        authentication.fetch();
        expect(settings.cbRequest).toHaveBeenCalled();
        expect(actualUrl).toEqual('http://localhost:9950/RestService/v4/auth/token');
    });

    it('Should be able to pass new AuthenticationSettings object', () => {
        let actualUrl: string;
        let settings = new AuthenticationSettings({
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url;
                return false;
            }),
            cbSuccess: jest.fn(),
        });

        let authentication = new Authentication('http://localhost:9950/', settings);
        let pAuthentication = authentication as any;

        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toBeFalsy();
        expect(pAuthentication.baseUrl).toEqual('http://localhost:9950/RestService/v4');
        expect(pAuthentication.settings.cbRequest).toBeDefined();
        expect(pAuthentication.settings.cbSuccess).toBeDefined();
        expect(pAuthentication.settings.url).toEqual('auth/token');

        authentication.fetch();
        expect(settings.cbRequest).toHaveBeenCalled();
        expect(actualUrl).toEqual('http://localhost:9950/RestService/v4/auth/token');
    });

    it('Should be able to pass anonymous object settings', () => {
        let actualUrl: string;
        let settings = {
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url;
                return false;
            }),
            cbSuccess: jest.fn(),
        };

        let authentication = new Authentication('http://localhost:9950/', settings);
        let pAuthentication = authentication as any;

        expect(pAuthentication.settings).toBeDefined();
        expect(pAuthentication.settings.enabled).toBeFalsy();
        expect(pAuthentication.baseUrl).toEqual('http://localhost:9950/RestService/v4');
        expect(pAuthentication.settings.cbRequest).toBeDefined();
        expect(pAuthentication.settings.cbSuccess).toBeDefined();
        expect(pAuthentication.settings.url).toEqual('auth/token');

        authentication.fetch();
        expect(settings.cbRequest).toHaveBeenCalled();
        expect(actualUrl).toEqual('http://localhost:9950/RestService/v4/auth/token');
    });

    it('Should call refresh for auth-token', () => {
        let now = new Date().valueOf() / 1000;
        let exp = now + (15 * 60); // Expires in 15 minutes
        let payload = { exp };

        let settings = {
            token: jwt.encode(payload, 'test'),
            triggers: {
                expiryOverlap: 15,
            },
        } as AuthenticationSettings;

        let decoded = jwt.decode(settings.token, null, true);
        expect(decoded.exp).toEqual(payload.exp);

        settings.cbRequest = jest.fn(() => {
            // Block executing the fetch call
            return false;
        });

        jest.useFakeTimers();

        let authentication = new Authentication('http://localhost:9950/', settings);
        let pAuthentication = authentication as any;
        jest.runAllTimers();
        expect(typeof pAuthentication.auth).toBe('object');
        expect(pAuthentication.settings.cbRequest).toEqual(settings.cbRequest);
        expect(settings.cbRequest).toBeCalled();
        expect((setTimeout as any).mock.calls.length).toBe(1);
        expect((setTimeout as any).mock.calls[0][1]).toBeGreaterThan(850);
    });

});
