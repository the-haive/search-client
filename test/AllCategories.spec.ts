// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';

dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { Categories } from '../src/Data/Categories';
import { AllCategories } from '../src/AllCategories';

describe("AllCategories basics", () => {

    it("Should have imported AllCategories class defined", () => {
        expect(typeof AllCategories).toBe("function");
    });

    it("Should be able to create AllCategories instance", () => {
        let allCategories = new AllCategories("http://localhost:9950/RestService/v3/");
        expect(typeof allCategories).toBe("object");
        expect(allCategories instanceof AllCategories).toBeTruthy();
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let allCategories = new AllCategories("file://localhost:9950/RestService/v3/");
        }).toThrow();

        expect(() => {
            let allCategories = new AllCategories("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

});
