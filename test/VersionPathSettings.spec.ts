// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { VersionPathSettings } from '../src/Common/VersionPathSettings';

class VersionPathSettingsImplementation extends VersionPathSettings {

}

describe("VersionPathSettings basics", () => {

    it("Should throw for version not 2 or 3", () => {
        expect( () => {
            let v = new VersionPathSettingsImplementation({version: 1});
        }).toThrow();

        expect( () => {
            let v = new VersionPathSettingsImplementation({version: 4});
        }).toThrow();
    });
    
    it("Should work with default VersionPathSettings", () => {
        let v = new VersionPathSettingsImplementation();

        expect(v.version).toBe(3);
        expect(v.path).toBe("RestService/v3");
    });

    it("Should work with custom v2 ", () => {
        let v = new VersionPathSettingsImplementation({version: 2});

        expect(v.version).toBe(2);
        expect(v.path).toBe("RestService/v2");
    });
    
    it("Should work with custom v3 ", () => {
        let v = new VersionPathSettingsImplementation({version: 3});

        expect(v.version).toBe(3);
        expect(v.path).toBe("RestService/v3");
    });
    
    it("Should work with custom path ", () => {
        let v = new VersionPathSettingsImplementation({path: "//My/Path//"});

        expect(v.version).toBe(3);
        expect(v.path).toBe("My/Path");
    });
    
});
