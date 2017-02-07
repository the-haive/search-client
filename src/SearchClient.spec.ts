"use strict";

import 'jest';
// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { SearchClient, Query } from "./SearchClient";

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

    it("Search instance should have find() and categorize() interface", () => {
        let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
        expect(typeof searchClient.find).toBe("function");
        expect(typeof searchClient.categorize).toBe("function");
        // TODO add additional interfaces (allCategories / bestBets)
    });
});

describe("SearchClient find()", () => {
    it("find('.') should return results", () => {
        let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
        return searchClient.find(new Query("."))
            .then((matches) => {
                expect(typeof matches).toBe("object");
            })
            .catch((e) => {
                fail(e);
            });
    });
});

describe("SearchClient categorize()", () => {
    it("categorize('.') should return results", () => {
      let searchClient = new SearchClient("http://localhost:9950/RestService/v3/");
      return searchClient.categorize(new Query("."))
          .then((categories) => {
              expect(typeof categories).toBe("object");
          })
          .catch((e) => {
              fail(e);
          });
    });
});
