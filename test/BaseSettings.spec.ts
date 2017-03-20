// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { BaseSettings } from '../src/Common/BaseSettings';

class BaseSettingsImplementation extends BaseSettings<string> {

}

describe("BaseSettings basics", () => {

    it("Should throw for version not 2 or 3", () => {
        expect( () => {
            let v = new BaseSettingsImplementation({version: 1});
        }).toThrow();

        expect( () => {
            let v = new BaseSettingsImplementation({version: 4});
        }).toThrow();
    });
    
    it("Should work with default VersionPathSettings", () => {
        let settings = new BaseSettingsImplementation();

        // VersionPathSettings
        expect(settings.version).toBe(3);
        expect(settings.path).toBe("RestService/v3");

        // BaseSettings
        expect(settings.enabled).toBe(true);
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
    });

    it("Should work with empty object", () => {
        let settings = new BaseSettingsImplementation({});

        // VersionPathSettings
        expect(settings.version).toBe(3);
        expect(settings.path).toBe("RestService/v3");

        // BaseSettings
        expect(settings.enabled).toBe(true);
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
    });

    it("Should work with enabled false", () => {
        let settings = new BaseSettingsImplementation({enabled: false});

        // VersionPathSettings
        expect(settings.version).toBe(3);
        expect(settings.path).toBe("RestService/v3");

        // BaseSettings
        expect(settings.enabled).toBe(false);
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
    });
    
    it("Should work with enabled true", () => {
        let settings = new BaseSettingsImplementation({enabled: true});

        // VersionPathSettings
        expect(settings.version).toBe(3);
        expect(settings.path).toBe("RestService/v3");

        // BaseSettings
        expect(settings.enabled).toBe(true);
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
    });
    
    it("Should work with cbError", () => {
        let settings = new BaseSettingsImplementation({cbError: (e) => { /*dummy*/ } });

        // VersionPathSettings
        expect(settings.version).toBe(3);
        expect(settings.path).toBe("RestService/v3");

        // BaseSettings
        expect(settings.enabled).toBe(true);
        expect(settings.cbError).toBeDefined();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
    });
    
    it("Should work with cbRequest", () => {
        let settings = new BaseSettingsImplementation({cbRequest: (url: string, reqInit: RequestInit) => { return false; } });

        // VersionPathSettings
        expect(settings.version).toBe(3);
        expect(settings.path).toBe("RestService/v3");

        // BaseSettings
        expect(settings.enabled).toBe(true);
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbRequest).toBeDefined();
        expect(settings.cbSuccess).toBeUndefined();
    });
    
    it("Should work with cbSuccess", () => {
        let settings = new BaseSettingsImplementation({cbSuccess: (data: string) => { /* dummy*/ } });

        // VersionPathSettings
        expect(settings.version).toBe(3);
        expect(settings.path).toBe("RestService/v3");

        // BaseSettings
        expect(settings.enabled).toBe(true);
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbSuccess).toBeDefined();
    });
    
    it("Should work with custom path ", () => {
        let settings = new BaseSettingsImplementation({enabled: false, version: 2, path: "//My/Path//"});

        expect(settings.version).toBe(2);
        expect(settings.path).toBe("My/Path");

        // BaseSettings
        expect(settings.enabled).toBe(false);
        expect(settings.cbError).toBeUndefined();
        expect(settings.cbRequest).toBeUndefined();
        expect(settings.cbSuccess).toBeUndefined();
    });
});
