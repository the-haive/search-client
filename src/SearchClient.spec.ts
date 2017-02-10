"use strict";

import 'jest';

// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { SearchClient, Query, Matches } from "./SearchClient";

describe("SearchClient basics", () => {
    it("Should have imported SearchClient class defined", () => {
        expect(typeof SearchClient).toBe("function");
    });

    it("Should be able to create SearchClient instance", () => {
        let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
        expect(typeof searchClient).toBe("object");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let searchClient = new SearchClient("file://localhost:9950/RestService/v3/");
        }).toThrow();
        expect(() => {
            let searchClient = new SearchClient("http:+//localhost:9950/RestService/v3/");
        }).toThrow();
    });

    it("Search instance should have autocomplete(), find(), categorize(), allCategories() and bestBets() interface", () => {
        let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
        expect(typeof searchClient.autocomplete).toBe("function");
        expect(typeof searchClient.find).toBe("function");
        expect(typeof searchClient.categorize).toBe("function");
        expect(typeof searchClient.allCategories).toBe("function");
        expect(typeof searchClient.bestBets).toBe("function");
    });
});
