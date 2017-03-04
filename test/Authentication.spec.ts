// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';

dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { Categories } from '../src/Data/Categories';
import {Authentication} from '../src/Authentication';

describe("Authentication basics", () => {

    it("Should have imported Authentication class defined", () => {
        expect(typeof Authentication).toBe("function");
    });

    it("Should be able to create Authentication instance", () => {
        let authentication = new Authentication("http://localhost:9950/RestService/v3/");
        expect(typeof authentication).toBe("object");
        expect(authentication instanceof Authentication).toBeTruthy();
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let authentication = new Authentication("file://localhost:9950/RestService/v3/");
        }).toThrow();

        expect(() => {
            let authentication = new Authentication("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

});
