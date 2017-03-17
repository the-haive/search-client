import { SearchClient } from '../src/SearchClient';
// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';
dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { Categorize } from '../src/Categorize';
import { CategorizeSettings } from '../src/Categorize/CategorizeSettings';
import { CategorizeTriggers } from '../src/Categorize/CategorizeTriggers';
import { Categories, Group } from '../src/Data';

let reference: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));

describe("Categorize basics", () => {

    it("Should have imported Categorize class defined", () => {
        expect(typeof Categorize).toBe("function");
    });

    it("Should be able to create Categorize instance", () => {
        let categorize = new Categorize("http://localhost:9950/");
        let pCategorize = <any> categorize;

        expect(typeof categorize).toBe("object");
        expect(categorize instanceof Categorize).toBeTruthy();
        expect(pCategorize.settings.enabled).toEqual(true);
        expect(pCategorize.settings.cbError).toBeUndefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeUndefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("/search/categorize");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let categorize = new Categorize("file://localhost:9950");
        }).toThrow();

        expect(() => {
            let categorize = new Categorize("http:+//localhost:9950");
        }).toThrow();
    });

    it("Should be able to pass a default CategorizeSettings instance", () => {
        let categorize = new Categorize("http://localhost:9950/", new CategorizeSettings());
        let pCategorize = <any> categorize;

        expect(typeof pCategorize.auth).toBe("object");
        expect(pCategorize.settings.enabled).toEqual(true);
        expect(pCategorize.settings.cbError).toBeUndefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeUndefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("/search/categorize");
    });

    it("Should be able to pass an CategorizeSettings instance with additional settings", () => {
        let settings = new CategorizeSettings();
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.triggers = new CategorizeTriggers();
        settings.url = "/test";

        let categorize = new Categorize("http://localhost:9950/", settings);
        let pCategorize = <any> categorize;

        expect(typeof pCategorize.auth).toBe("object");
        expect(categorize.baseUrl).toEqual("http://localhost:9950/RestService/v3/");
        expect(pCategorize.settings.enabled).toEqual(false);
        expect(pCategorize.settings.cbError).toBeDefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeDefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("/test");
    });

    it("Should be able to pass a manual object settings as CategorizeSettings", () => {
        let settings = {
            cbError: (error: any) => { /* dummy */},
            cbSuccess: (data: Categories) => { /* dummy */},
            enabled: false,
            triggers: new CategorizeTriggers(),
            url: "/test",
        } as CategorizeSettings;

        let categorize = new Categorize("http://localhost:9950/", settings);
        let pCategorize = <any> categorize;

        expect(typeof pCategorize.auth).toBe("object");
        expect(categorize.baseUrl).toEqual("http://localhost:9950/RestService/v3/");
        expect(pCategorize.settings.enabled).toEqual(false);
        expect(pCategorize.settings.cbError).toBeDefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeDefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("/test");
    });

    it("Should be able to understand sample categories", () => {
        let categories: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));
        expect(categories.groups.length).toEqual(4);
        expect(categories.groups[0].name).toEqual("System");
        expect(categories.groups[0].expanded).toEqual(true);
        expect(categories.groups[0].categories.length).toEqual(1);
        expect(categories.groups[0].categories[0].expanded).toEqual(false);

        expect(categories.groups[1].name).toEqual("Author");
        expect(categories.groups[1].expanded).toEqual(false);
        expect(categories.groups[1].categories.length).toEqual(27);
        expect(categories.groups[1].categories[0].expanded).toEqual(false);
        expect(categories.groups[1].categories[1].expanded).toEqual(false);
        expect(categories.groups[1].categories[2].expanded).toEqual(false);
        expect(categories.groups[1].categories[3].expanded).toEqual(false);
        expect(categories.groups[1].categories[26].expanded).toEqual(false);
        expect(categories.groups[1].categories[27]).toBeUndefined();

        expect(categories.groups[2].name).toEqual("ModifiedDate");
        expect(categories.groups[2].expanded).toEqual(false);
        expect(categories.groups[2].categories.length).toEqual(3);
        expect(categories.groups[2].categories[0].name).toEqual("2007");
        expect(categories.groups[2].categories[0].expanded).toEqual(false);
        expect(categories.groups[2].categories[0].children.length).toEqual(3);
        expect(categories.groups[2].categories[0].children[0].expanded).toEqual(false);
        expect(categories.groups[2].categories[0].children[1].expanded).toEqual(false);
        expect(categories.groups[2].categories[0].children[2].expanded).toEqual(false);
        expect(categories.groups[2].categories[1].name).toEqual("2014");
        expect(categories.groups[2].categories[1].expanded).toEqual(false);
        expect(categories.groups[2].categories[1].children.length).toEqual(3);
        expect(categories.groups[2].categories[1].children[0].expanded).toEqual(false);
        expect(categories.groups[2].categories[1].children[1].expanded).toEqual(false);
        expect(categories.groups[2].categories[1].children[2].expanded).toEqual(false);
        expect(categories.groups[2].categories[2].name).toEqual("2015");
        expect(categories.groups[2].categories[2].expanded).toEqual(false);
        expect(categories.groups[2].categories[2].children.length).toEqual(3);
        expect(categories.groups[2].categories[2].children[0].expanded).toEqual(false);
        expect(categories.groups[2].categories[2].children[1].expanded).toEqual(false);
        expect(categories.groups[2].categories[2].children[2].expanded).toEqual(false);

        expect(categories.groups[3].name).toEqual("FileType");
        expect(categories.groups[3].expanded).toEqual(false);
        expect(categories.groups[3].categories.length).toEqual(4);
        expect(categories.groups[3].categories[0].name).toEqual("DOC");
        expect(categories.groups[3].categories[0].expanded).toEqual(false);
        expect(categories.groups[3].categories[0].children.length).toEqual(0);
        expect(categories.groups[3].categories[1].name).toEqual("PDF");
        expect(categories.groups[3].categories[1].expanded).toEqual(false);
        expect(categories.groups[3].categories[1].children.length).toEqual(0);
        expect(categories.groups[3].categories[2].name).toEqual("PPT");
        expect(categories.groups[3].categories[2].expanded).toEqual(false);
        expect(categories.groups[3].categories[2].children.length).toEqual(0);
        expect(categories.groups[3].categories[3].name).toEqual("HTML");
        expect(categories.groups[3].categories[3].expanded).toEqual(false);
        expect(categories.groups[3].categories[3].children.length).toEqual(0);

    });

    it("Should have no effect when there are no filters defined", () => {
        let workCopy: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));

        let client = new Categorize("http://localhost:9950/");
        let pClient = <any> client;

        // Expect no change, when no filter is added and running the filtermethod
        let results: Categories = pClient.filterCategories(workCopy);

        expect(results).toEqual(reference);
    });

    it("Should have no effect when filters are empty", () => {
        let workCopy: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));

        let client = new Categorize("http://localhost:9950/");
        let pClient = <any> client;

        // Expect no change when filters are set manually
        pClient.clientCategoryFilter = [];

        let results: Categories = pClient.filterCategories(workCopy);

        expect(results).toEqual(reference);
    });

    it("Should have no effect when the filter is null", () => {
        let workCopy: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));

        let client = new Categorize("http://localhost:9950/");
        let pClient = <any> client;
        // Expect no change when filters are set to null
        pClient.clientCategoryFilter = null;

        let results: Categories = pClient.filterCategories(workCopy);

        expect(results).toEqual(reference);
    });

    it("Should have no effect when the filter is undefined", () => {
        let workCopy: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));

        let client = new Categorize("http://localhost:9950/");
        let pClient = <any> client;
        
        // Expect no change when filters are set to null
        pClient.clientCategoryFilter = undefined;

        let results: Categories = pClient.filterCategories(workCopy);

        expect(results).toEqual(reference);
    });

    it("Should have no effect when the filter only has null-filters", () => {
        let workCopy: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));

        let client = new Categorize("http://localhost:9950/");
        let pClient = <any> client;
        
        // Expect no change when filters are set to null
        pClient.clientCategoryFilter = [[null, null]];

        let results: Categories = pClient.filterCategories(workCopy);

        expect(results).toEqual(reference);
    });

    it("Should be able to filter using direct mock on categorize", () => {
        let workCopy: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));

        let client = new Categorize("http://localhost:9950/");
        let pClient = <any> client;

        // Expect 
        pClient.clientCategoryFilter = {
            System: /---/,
            ModifiedDate: /---/,
            Author: /---/,
            FileType: /DOC/,
        };

        let results: Categories = pClient.filterCategories(workCopy);

        expect(results.groups.length).toEqual(4);
        expect(results.groups[0].categories.length).toEqual(0);
        expect(results.groups[1].categories.length).toEqual(0);
        expect(results.groups[2].categories.length).toEqual(0);

        expect(results.groups[3].name).toEqual("FileType");
        expect(results.groups[3].expanded).toEqual(true);
        expect(results.groups[3].categories.length).toEqual(1);
        expect(results.groups[3].categories[0].name).toEqual("DOC");
        expect(results.groups[3].categories[0].expanded).toEqual(true);
        expect(results.groups[3].categories[0].children.length).toEqual(0);
    });

    it("Should be able to change the clientCategoryFilter property in SearchClient", () => {
        let workCopy: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));

        let catResults: Categories = null; 

        let cbSuccessMock = jest.fn((cats: Categories) => {
            catResults = cats;
        });

        let client = new SearchClient("http://localhost:9950/", {
            categorize: {
                cbSuccess: cbSuccessMock,
            },
        });
        
        // Faking that categories has been received in the categorize service
        let pClient = <any> client.categorize;
        pClient.categories = workCopy;

        // Expect the filter to change the categories received
        client.clientCategoryFilters = {
            System: /---/,
            ModifiedDate: /201\d/,
            Author: /---/,
            FileType: /---/,
        };

        expect(cbSuccessMock).toHaveBeenCalledTimes(1);
        expect(catResults.groups.length).toEqual(4);

        // Expect the System node to be unchanged.
        expect(catResults.groups[0].name).toEqual("System");
        expect(catResults.groups[0].expanded).toEqual(true); 
        expect(catResults.groups[0].categories.length).toEqual(0);

        //console.log(catResults.groups[1]);
        expect(catResults.groups[1].name).toEqual("Author");
        expect(catResults.groups[1].expanded).toEqual(false);
        expect(catResults.groups[1].categories.length).toEqual(0);

        expect(catResults.groups[2].name).toEqual("ModifiedDate");
        expect(catResults.groups[2].expanded).toEqual(true);
        expect(catResults.groups[2].categories.length).toEqual(2);

        let c2014 = catResults.groups[2].categories.find((c) => c.name === "2014");
        expect(c2014.name).toEqual("2014");
        expect(c2014.expanded).toEqual(true);
        expect(c2014.children.length).toEqual(3);
        expect(c2014.children[0].expanded).toEqual(false);
        expect(c2014.children[1].expanded).toEqual(false);
        expect(c2014.children[2].expanded).toEqual(false);

        let c2015 = catResults.groups[2].categories.find((c) => c.name === "2015");
        expect(c2015.name).toEqual("2015");
        expect(c2015.expanded).toEqual(true);
        expect(c2015.children.length).toEqual(3);
        expect(c2015.children[0].expanded).toEqual(false);
        expect(c2015.children[1].expanded).toEqual(false);
        expect(c2015.children[2].expanded).toEqual(false);

        expect(catResults.groups[3].name).toEqual("FileType");
        expect(catResults.groups[3].expanded).toEqual(false);
        expect(catResults.groups[3].categories.length).toEqual(0);

    });

    it("Should be able to change the clientCategoryFilter property in SearchClient", () => {
        let workCopy: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));

        let catResults: Categories = null; 

        let cbSuccessMock = jest.fn((categories: Categories) => {
            catResults = categories;
        });

        let client = new SearchClient("http://localhost:9950/", {
            categorize: {
                cbSuccess: cbSuccessMock,
            },
        });
        
        // Faking that categories has been received in the categorize service
        let pClient = <any> client.categorize;
        pClient.categories = workCopy;

        // Expect the filter to change the categories received
        client.clientCategoryFilters = {
            ModifiedDate_2014: /.*/,
            ModifiedDate: /201\d/,
            Author: "la",
            FileType: /DOC|PDF/,
        };

        expect(cbSuccessMock).toHaveBeenCalledTimes(1);
        expect(catResults.groups.length).toEqual(4);

        // Expect the System node to be unchanged.
        expect(catResults.groups[0].name).toEqual(reference.groups[0].name);
        expect(catResults.groups[0].expanded).toEqual(reference.groups[0].expanded); 
        expect(catResults.groups[0].categories.length).toEqual(reference.groups[0].categories.length);
        expect(catResults.groups[0].categories[0].expanded).toEqual(reference.groups[0].categories[0].expanded);
        expect(catResults.groups[0].categories[0].children.length).toEqual(reference.groups[0].categories[0].children.length);

        //console.log(catResults.groups[1]);
        expect(catResults.groups[1].name).toEqual("Author");
        expect(catResults.groups[1].expanded).toEqual(true);
        expect(catResults.groups[1].categories.length).toEqual(4);
        expect(catResults.groups[1].categories[0].expanded).toEqual(true);
        expect(catResults.groups[1].categories[1].expanded).toEqual(true);
        expect(catResults.groups[1].categories[2].expanded).toEqual(true);
        expect(catResults.groups[1].categories[3].expanded).toEqual(true);

        expect(catResults.groups[2].name).toEqual("ModifiedDate");
        expect(catResults.groups[2].expanded).toEqual(true);
        expect(catResults.groups[2].categories.length).toEqual(2);

        let c2014 = catResults.groups[2].categories.find((c) => c.name === "2014");
        expect(c2014.name).toEqual("2014");
        expect(c2014.expanded).toEqual(true);
        expect(c2014.children.length).toEqual(3);
        expect(c2014.children[0].expanded).toEqual(true);
        expect(c2014.children[1].expanded).toEqual(true);
        expect(c2014.children[2].expanded).toEqual(true);

        let c2015 = catResults.groups[2].categories.find((c) => c.name === "2015");
        expect(c2015.name).toEqual("2015");
        expect(c2015.expanded).toEqual(true);
        expect(c2015.children.length).toEqual(3);
        expect(c2015.children[0].expanded).toEqual(false);
        expect(c2015.children[1].expanded).toEqual(false);
        expect(c2015.children[2].expanded).toEqual(false);

        expect(catResults.groups[3].name).toEqual("FileType");
//        expect(catResults.groups[3].expanded).toEqual(true);
        expect(catResults.groups[3].categories.length).toEqual(2);
        expect(catResults.groups[3].categories[0].name).toEqual("DOC");
        expect(catResults.groups[3].categories[0].expanded).toEqual(true);
        expect(catResults.groups[3].categories[0].children.length).toEqual(0);
        expect(catResults.groups[3].categories[1].name).toEqual("PDF");
        expect(catResults.groups[3].categories[1].expanded).toEqual(true);
        expect(catResults.groups[3].categories[1].children.length).toEqual(0);

    });

    it("Should be possible to change the clientCategoryFilterSepChar setting in the SearchClient", () => {
        let workCopy: Categories = JSON.parse(require('fs').readFileSync('./test/data/categories.json', 'utf8'));

        let catResults: Categories = null; 

        let cbSuccessMock = jest.fn((categories: Categories) => {
            catResults = categories;
        });

        let client = new SearchClient("http://localhost:9950/", {
            categorize: {
                cbSuccess: cbSuccessMock,
                clientCategoryFiltersSepChar: "|",
            },
        });
        
        // Faking that categories has been received in the categorize service
        let pClient = <any> client.categorize;
        pClient.categories = workCopy;

        // Expect the filter to change the categories received
        client.clientCategoryFilters = {
            "ModifiedDate|2014": /.*/,
            "ModifiedDate": /201\d/,
            "Author": "la",
            "FileType": /DOC|PDF/,
        };

        expect(cbSuccessMock).toHaveBeenCalledTimes(1);
        expect(catResults.groups.length).toEqual(4);

        // Expect the System node to be unchanged.
        expect(catResults.groups[0].name).toEqual(reference.groups[0].name);
        expect(catResults.groups[0].expanded).toEqual(reference.groups[0].expanded); 
        expect(catResults.groups[0].categories.length).toEqual(reference.groups[0].categories.length);
        expect(catResults.groups[0].categories[0].expanded).toEqual(reference.groups[0].categories[0].expanded);
        expect(catResults.groups[0].categories[0].children.length).toEqual(reference.groups[0].categories[0].children.length);

        //console.log(catResults.groups[1]);
        expect(catResults.groups[1].name).toEqual("Author");
        expect(catResults.groups[1].expanded).toEqual(true);
        expect(catResults.groups[1].categories.length).toEqual(4);
        expect(catResults.groups[1].categories[0].expanded).toEqual(true);
        expect(catResults.groups[1].categories[1].expanded).toEqual(true);
        expect(catResults.groups[1].categories[2].expanded).toEqual(true);
        expect(catResults.groups[1].categories[3].expanded).toEqual(true);

        expect(catResults.groups[2].name).toEqual("ModifiedDate");
        expect(catResults.groups[2].expanded).toEqual(true);
        expect(catResults.groups[2].categories.length).toEqual(2);

        let c2014 = catResults.groups[2].categories.find((c) => c.name === "2014");
        expect(c2014.name).toEqual("2014");
        expect(c2014.expanded).toEqual(true);
        expect(c2014.children.length).toEqual(3);
        expect(c2014.children[0].expanded).toEqual(true);
        expect(c2014.children[1].expanded).toEqual(true);
        expect(c2014.children[2].expanded).toEqual(true);

        let c2015 = catResults.groups[2].categories.find((c) => c.name === "2015");
        expect(c2015.name).toEqual("2015");
        expect(c2015.expanded).toEqual(true);
        expect(c2015.children.length).toEqual(3);
        expect(c2015.children[0].expanded).toEqual(false);
        expect(c2015.children[1].expanded).toEqual(false);
        expect(c2015.children[2].expanded).toEqual(false);

        expect(catResults.groups[3].name).toEqual("FileType");
//        expect(catResults.groups[3].expanded).toEqual(true);
        expect(catResults.groups[3].categories.length).toEqual(2);
        expect(catResults.groups[3].categories[0].name).toEqual("DOC");
        expect(catResults.groups[3].categories[0].expanded).toEqual(true);
        expect(catResults.groups[3].categories[0].children.length).toEqual(0);
        expect(catResults.groups[3].categories[1].name).toEqual("PDF");
        expect(catResults.groups[3].categories[1].expanded).toEqual(true);
        expect(catResults.groups[3].categories[1].children.length).toEqual(0);

    });
});
