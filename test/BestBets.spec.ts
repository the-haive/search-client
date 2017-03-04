// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';

dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { Categories } from '../src/Data/Categories';
import { BestBets } from '../src/BestBets';

describe("BestBets basics", () => {

    it("Should have imported BestBets class defined", () => {
        expect(typeof BestBets).toBe("function");
    });

    it("Should be able to create BestBets instance", () => {
        let bestBets = new BestBets("http://localhost:9950/RestService/v3/");
        expect(typeof bestBets).toBe("object");
        expect(bestBets instanceof BestBets).toBeTruthy();
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let bestBets = new BestBets("file://localhost:9950/RestService/v3/");
        }).toThrow();

        expect(() => {
            let allCategories = new BestBets("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

});
