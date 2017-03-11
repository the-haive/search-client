// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';

dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { Autocomplete } from '../src/Autocomplete';

describe("Autocomplete basics", () => {

    it("Should have imported Autocomplete class defined", () => {
        expect(typeof Autocomplete).toBe("function");
    });

    it("Should be able to create Autocomplete instance", () => {
        let autocomplete = new Autocomplete("http://localhost:9950/RestService/v3/");
        expect(typeof autocomplete).toBe("object");
        expect(autocomplete instanceof Autocomplete).toBeTruthy();
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let autocomplete = new Autocomplete("file://localhost:9950/RestService/v3/");
        }).toThrow();

        expect(() => {
            let autocomplete = new Autocomplete("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

});
