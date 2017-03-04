// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';

dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { Categories } from '../src/Data/Categories';
import { Find } from '../src/Find';

describe("Find basics", () => {

    it("Should have imported Find class defined", () => {
        expect(typeof Find).toBe("function");
    });

    it("Should be able to create Find instance", () => {
        let find = new Find("http://localhost:9950/RestService/v3/");
        expect(typeof find).toBe("object");
        expect(find instanceof Find).toBeTruthy();
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let find = new Find("file://localhost:9950/RestService/v3/");
        }).toThrow();

        expect(() => {
            let find = new Find("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

});
