import fetch from "jest-fetch-mock";

import { Categorize, CategorizeSettings, CategorizeTriggers } from ".";
import { Categories } from "../Data";

// tslint:disable-next-line
const reference: Categories = require("../test-data/categories.json");

function sanityCheck(categories: Categories) {
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
    expect(categories.groups[2].categories[0].children[0].expanded).toEqual(
        false
    );
    expect(categories.groups[2].categories[0].children[1].expanded).toEqual(
        false
    );
    expect(categories.groups[2].categories[0].children[2].expanded).toEqual(
        false
    );
    expect(categories.groups[2].categories[1].name).toEqual("2014");
    expect(categories.groups[2].categories[1].expanded).toEqual(false);
    expect(categories.groups[2].categories[1].children.length).toEqual(3);
    expect(categories.groups[2].categories[1].children[0].expanded).toEqual(
        false
    );
    expect(categories.groups[2].categories[1].children[1].expanded).toEqual(
        false
    );
    expect(categories.groups[2].categories[1].children[2].expanded).toEqual(
        false
    );
    expect(categories.groups[2].categories[2].name).toEqual("2015");
    expect(categories.groups[2].categories[2].expanded).toEqual(false);
    expect(categories.groups[2].categories[2].children.length).toEqual(3);
    expect(categories.groups[2].categories[2].children[0].expanded).toEqual(
        false
    );
    expect(categories.groups[2].categories[2].children[1].expanded).toEqual(
        false
    );
    expect(categories.groups[2].categories[2].children[2].expanded).toEqual(
        false
    );

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
}

describe("Categorize basics", () => {
    it("Should have imported Categorize class defined", () => {
        expect(typeof Categorize).toBe("function");
    });

    it("Should be able to create Categorize instance", () => {
        let categorize = new Categorize("http://localhost:9950/");
        let pCategorize = categorize as any;

        expect(typeof categorize).toBe("object");
        expect(categorize instanceof Categorize).toBeTruthy();
        expect(pCategorize.settings.enabled).toEqual(true);
        expect(pCategorize.settings.cbError).toBeUndefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeUndefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("search/categorize");
    });

    it("Should throw for invalid Urls", () => {
        expect(() => {
            let categorize = new Categorize("file://localhost:9950");
            expect(typeof categorize).toBe("object");
        }).toThrow();

        expect(() => {
            let categorize = new Categorize("http:+//localhost:9950");
            expect(typeof categorize).toBe("object");
        }).toThrow();
    });

    it("Should be able to pass a default CategorizeSettings instance", () => {
        let categorize = new Categorize(
            "http://localhost:9950/",
            new CategorizeSettings()
        );
        let pCategorize = categorize as any;

        expect(typeof pCategorize.auth).toBe("object");
        expect(pCategorize.settings.enabled).toEqual(true);
        expect(pCategorize.settings.cbError).toBeUndefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeUndefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("search/categorize");
    });

    it("Should be able to pass a CategorizeSettings instance with additional settings", () => {
        let settings = new CategorizeSettings();
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.triggers = new CategorizeTriggers();
        settings.url = "/test";

        let categorize = new Categorize("http://localhost:9950/", settings);
        let pCategorize = categorize as any;

        expect(typeof pCategorize.auth).toBe("object");
        expect(categorize.baseUrl).toEqual(
            "http://localhost:9950/RestService/v4"
        );
        expect(pCategorize.settings.enabled).toEqual(false);
        expect(pCategorize.settings.cbError).toBeDefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeDefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("test");
    });

    it("Should be able to pass a manual object settings as CategorizeSettings", () => {
        let settings = {
            cbError: (error: any) => {
                /* dummy */
            },
            cbSuccess: (data: Categories) => {
                /* dummy */
            },
            enabled: false,
            triggers: new CategorizeTriggers(),
            url: "/test"
        } as CategorizeSettings;

        let categorize = new Categorize("http://localhost:9950/", settings);
        let pCategorize = categorize as any;

        expect(typeof pCategorize.auth).toBe("object");
        expect(categorize.baseUrl).toEqual(
            "http://localhost:9950/RestService/v4"
        );
        expect(pCategorize.settings.enabled).toEqual(false);
        expect(pCategorize.settings.cbError).toBeDefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeDefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual("test");
    });

    it("Should be able to Categorize some results", () => {
        // tslint:disable-next-line:no-require-imports
        const categories: Categories = require("../test-data/categories.json");
        fetch.mockResponse(JSON.stringify(categories));

        let settings = {
            cbRequest: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
                return true;
            })
        } as CategorizeSettings;

        let categorize = new Categorize(
            "http://localhost:9950/",
            settings,
            null,
            fetch
        );
        categorize
            .fetch()
            .then((response: Categories) => {
                expect(typeof response).toBe("object");
                expect(response.groups.length).toBe(6);
            })
            .catch(error => {
                fail("Should not fail");
            })
            .then(() => {
                expect(settings.cbRequest).toHaveBeenCalled();
            });
    });

    it("Should be able to stop a Categorize using cbRequest", () => {
        // Not caring about the response, just to allow the fetch to complete.
        fetch.mockResponse(JSON.stringify({}));
        let settings = {
            cbRequest: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
                // Stop the request
                return false;
            })
        } as CategorizeSettings;

        let categorize = new Categorize(
            "http://localhost:9950/",
            settings,
            null,
            fetch
        );
        categorize
            .fetch()
            .then(response => {
                expect(response).toBeNull();
            })
            .catch(error => {
                fail("Should not yield an error");
            })
            .then(() => {
                expect(settings.cbRequest).toHaveBeenCalled();
            });
    });

    it("Should be able to understand sample categories", () => {
        // tslint:disable-next-line:no-require-imports
        let categories: Categories = require("../test-data/categories.json");
        sanityCheck(categories);
    });

    it("Should have no effect when there are no filters defined", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: Categories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize("http://localhost:9950/");
        let pClient = client as any;

        // Expect no change, when no filter is added and running the filtermethod
        let results: Categories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results).toEqual(reference);
    });

    it("Should have no effect when filters are empty", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: Categories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize("http://localhost:9950/");
        let pClient = client as any;

        // Expect no change when filters are set manually
        pClient.clientCategoryFilter = [];

        let results: Categories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results).toEqual(reference);
    });

    it("Should have no effect when the filter is null", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: Categories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize("http://localhost:9950/");
        let pClient = client as any;
        // Expect no change when filters are set to null
        pClient.clientCategoryFilter = null;

        let results: Categories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results).toEqual(reference);
    });

    it("Should have no effect when the filter is undefined", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: Categories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize("http://localhost:9950/");
        let pClient = client as any;

        // Expect no change when filters are set to null
        pClient.clientCategoryFilter = undefined;

        let results: Categories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results).toEqual(reference);
    });

    it("Should have no effect when the filter only has null-filters", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: Categories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let settings = {
            cbRequest: jest.fn(() => false)
        };

        let client = new Categorize("http://localhost:9950/", settings);
        let pClient = client as any;

        // Expect no change when filters are set to null
        pClient.clientCategoryFilter = [[null, null]];

        let results: Categories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(settings.cbRequest).toHaveBeenCalledTimes(0);
        expect(results).toEqual(reference);
    });

    it("Should be able to filter using direct mock on categorize", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: Categories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize("http://localhost:9950/");
        let pClient = client as any;

        // Expect
        pClient.clientCategoryFilter = {
            System: /---/,
            ModifiedDate: /---/,
            Author: /---/,
            FileType: /Word/
        };

        let results: Categories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

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

    it("Should be possible to use the createCategoryFilter method to create filters, with string[] input", () => {
        // tslint:disable-next-line:no-require-imports
        let categorize = new Categorize("http://localhost:9950");
        categorize.categories = reference;
        const filterSystemFile = categorize.createCategoryFilter([
            "System",
            "File",
            "Testdata",
            "Norway"
        ]);
        expect(filterSystemFile.displayName.length).toEqual(4);
        expect(filterSystemFile.displayName[0]).toEqual("Kilde");
        expect(filterSystemFile.displayName[1]).toEqual("Filer");
        expect(filterSystemFile.displayName[2]).toEqual("Test data");
        expect(filterSystemFile.displayName[3]).toEqual("Norge");
        expect(filterSystemFile.category.categoryName[0]).toEqual("System");
        expect(filterSystemFile.category.categoryName[1]).toEqual("File");
        expect(filterSystemFile.category.categoryName[2]).toEqual("Testdata");
        expect(filterSystemFile.category.categoryName[3]).toEqual("Norway");
        expect(filterSystemFile.category.children.length).toEqual(0);
        expect(filterSystemFile.category.count).toEqual(101);
        expect(filterSystemFile.category.displayName).toEqual("Norge");
        expect(filterSystemFile.category.expanded).toEqual(false);
        expect(filterSystemFile.category.name).toEqual("Norway");
        const filterAuthorLarsFrode = categorize.createCategoryFilter([
            "Author",
            "Lars Frode"
        ]);
        expect(filterAuthorLarsFrode.displayName[0]).toEqual("Forfatter");
        expect(filterAuthorLarsFrode.displayName[1]).toEqual("Lars Frode");
        expect(filterAuthorLarsFrode.category.categoryName[0]).toEqual(
            "Author"
        );
        expect(filterAuthorLarsFrode.category.categoryName[1]).toEqual(
            "Lars Frode"
        );
        expect(filterAuthorLarsFrode.category.children.length).toEqual(0);
        expect(filterAuthorLarsFrode.category.count).toEqual(1);
        expect(filterAuthorLarsFrode.category.displayName).toEqual(
            "Lars Frode"
        );
        expect(filterAuthorLarsFrode.category.expanded).toEqual(false);
        expect(filterAuthorLarsFrode.category.name).toEqual("Lars Frode");
        const filterFileTypeDoc = categorize.createCategoryFilter([
            "FileType",
            "DOC"
        ]);
        expect(filterFileTypeDoc.displayName[0]).toEqual("Filtype");
        expect(filterFileTypeDoc.displayName[1]).toEqual("Word");
        expect(filterFileTypeDoc.category.categoryName[0]).toEqual("FileType");
        expect(filterFileTypeDoc.category.categoryName[1]).toEqual("DOC");
        expect(filterFileTypeDoc.category.children.length).toEqual(0);
        expect(filterFileTypeDoc.category.count).toEqual(19);
        expect(filterFileTypeDoc.category.displayName).toEqual("Word");
        expect(filterFileTypeDoc.category.expanded).toEqual(false);
        expect(filterFileTypeDoc.category.name).toEqual("DOC");
    });

    it("Should be possible to use the createCategoryFilter method to create filters, with Category input", () => {
        let categorize = new Categorize("http://localhost:9950");
        categorize.categories = reference;
        const filterSystemFile = categorize.createCategoryFilter(
            reference.groups[0].categories[0].children[0].children[0]
        );
        expect(filterSystemFile.displayName.length).toEqual(4);
        expect(filterSystemFile.displayName[0]).toEqual("Kilde");
        expect(filterSystemFile.displayName[1]).toEqual("Filer");
        expect(filterSystemFile.displayName[2]).toEqual("Test data");
        expect(filterSystemFile.displayName[3]).toEqual("Norge");
        expect(filterSystemFile.category.categoryName[0]).toEqual("System");
        expect(filterSystemFile.category.categoryName[1]).toEqual("File");
        expect(filterSystemFile.category.categoryName[2]).toEqual("Testdata");
        expect(filterSystemFile.category.categoryName[3]).toEqual("Norway");
        expect(filterSystemFile.category.children.length).toEqual(0);
        expect(filterSystemFile.category.count).toEqual(101);
        expect(filterSystemFile.category.displayName).toEqual("Norge");
        expect(filterSystemFile.category.expanded).toEqual(false);
        expect(filterSystemFile.category.name).toEqual("Norway");
        const filterAuthorLarsFrode = categorize.createCategoryFilter(
            reference.groups[1].categories[18]
        );
        expect(filterAuthorLarsFrode.displayName[0]).toEqual("Forfatter");
        expect(filterAuthorLarsFrode.displayName[1]).toEqual("Lars Frode");
        expect(filterAuthorLarsFrode.category.categoryName[0]).toEqual(
            "Author"
        );
        expect(filterAuthorLarsFrode.category.categoryName[1]).toEqual(
            "Lars Frode"
        );
        expect(filterAuthorLarsFrode.category.children.length).toEqual(0);
        expect(filterAuthorLarsFrode.category.count).toEqual(1);
        expect(filterAuthorLarsFrode.category.displayName).toEqual(
            "Lars Frode"
        );
        expect(filterAuthorLarsFrode.category.expanded).toEqual(false);
        expect(filterAuthorLarsFrode.category.name).toEqual("Lars Frode");
        const filterFileTypeDoc = categorize.createCategoryFilter(
            reference.groups[3].categories[0]
        );
        expect(filterFileTypeDoc.displayName[0]).toEqual("Filtype");
        expect(filterFileTypeDoc.displayName[1]).toEqual("Word");
        expect(filterFileTypeDoc.category.categoryName[0]).toEqual("FileType");
        expect(filterFileTypeDoc.category.categoryName[1]).toEqual("DOC");
        expect(filterFileTypeDoc.category.children.length).toEqual(0);
        expect(filterFileTypeDoc.category.count).toEqual(19);
        expect(filterFileTypeDoc.category.displayName).toEqual("Word");
        expect(filterFileTypeDoc.category.expanded).toEqual(false);
        expect(filterFileTypeDoc.category.name).toEqual("DOC");
    });
    it("Should be able to toggle expanded state using direct mock on categorize", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: Categories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize("http://localhost:9950/");
        let pClient = client as any;

        // Expect
        expect(workCopy.groups[0].name).toEqual("System");
        expect(workCopy.groups[0].categories[0].name).toEqual("File");
        expect(workCopy.groups[0].categories[0].expanded).toBeFalsy();
        expect(workCopy.groups[0].categories[0].children[0].name).toEqual(
            "Testdata"
        );
        expect(
            workCopy.groups[0].categories[0].children[0].children[0].name
        ).toEqual("Norway");
        expect(
            workCopy.groups[0].categories[0].children[0].children[0].expanded
        ).toBeFalsy();

        pClient.clientCategoryExpansion = {
            "System|File": true,
            "System|File|Testdata": true,
            "System|File|Testdata|Norway": true
        } as { [key: string]: boolean };

        let results: Categories = pClient.filterCategories(workCopy);

        expect(results.groups[0].name).toEqual("System");
        expect(results.groups[0].categories[0].name).toEqual("File");
        expect(results.groups[0].categories[0].expanded).toBeTruthy();
        expect(results.groups[0].categories[0].children[0].name).toEqual(
            "Testdata"
        );
        expect(
            results.groups[0].categories[0].children[0].expanded
        ).toBeTruthy();
        expect(
            results.groups[0].categories[0].children[0].children[0].name
        ).toEqual("Norway");
        expect(
            results.groups[0].categories[0].children[0].children[0].expanded
        ).toBeTruthy();
    });
});
