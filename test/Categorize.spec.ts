// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';

dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { Categorize } from '../src/Categorize';

describe("Categorize basics", () => {

    it("Should have imported Categorize class defined", () => {
        expect(typeof Categorize).toBe("function");
    });

    it("Should be able to create Categorize instance", () => {
        let categorize = new Categorize("http://localhost:9950/RestService/v3/");
        expect(typeof categorize).toBe("object");
        expect(categorize instanceof Categorize).toBeTruthy();
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let categorize = new Categorize("file://localhost:9950/RestService/v3/");
        }).toThrow();

        expect(() => {
            let categorize = new Categorize("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

});
