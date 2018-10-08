import fetch from "jest-fetch-mock";

import {
    Categorize,
    CategorizeSettings,
    ICategorizeSettings,
    CategorizeTriggers
} from ".";
import { Category, Categories } from "../Data";
import { Filter, Query } from "../Common";

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
        expect(pCategorize.settings.url).toEqual(
            "http://localhost:9950/RestService/v4/search/categorize"
        );
    });

    it("Should not throw, even for invalid urls. Not perfect, but avoids an additional dependency.", () => {
        expect(() => {
            let categorize = new Categorize("file://localhost:9950");
            expect(typeof categorize).toBe("object");
        }).not.toThrow();

        expect(() => {
            let categorize = new Categorize("http:+//localhost:9950");
            expect(typeof categorize).toBe("object");
        }).not.toThrow();
    });

    it("Should be able to pass a default CategorizeSettings instance", () => {
        let categorize = new Categorize("http://localhost:9950/");
        let pCategorize = categorize as any;

        expect(typeof pCategorize.auth).toBe("object");
        expect(pCategorize.settings.enabled).toEqual(true);
        expect(pCategorize.settings.cbError).toBeUndefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeUndefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual(
            "http://localhost:9950/RestService/v4/search/categorize"
        );
    });

    it("Should be able to pass a CategorizeSettings instance with additional settings", () => {
        let settings = new CategorizeSettings("http://localhost:9950/");
        settings.cbError = jest.fn();
        settings.cbSuccess = jest.fn();
        settings.enabled = false;
        settings.triggers = new CategorizeTriggers();
        settings.basePath = "/test";

        let categorize = new Categorize(settings);
        let pCategorize = categorize as any;

        expect(typeof pCategorize.auth).toBe("object");
        expect(pCategorize.settings.baseUrl).toEqual("http://localhost:9950");
        expect(pCategorize.settings.enabled).toEqual(false);
        expect(pCategorize.settings.cbError).toBeDefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeDefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual(
            "http://localhost:9950/test/search/categorize"
        );
    });

    it("Should be able to pass a manual object settings as CategorizeSettings", () => {
        let settings = {
            baseUrl: "http://localhost:9950/",
            cbError: (error: any) => {
                /* dummy */
            },
            cbSuccess: (data: Categories) => {
                /* dummy */
            },
            enabled: false,
            triggers: new CategorizeTriggers(),
            basePath: "/test"
        } as ICategorizeSettings;

        let categorize = new Categorize(settings);
        let pCategorize = categorize as any;

        expect(typeof pCategorize.auth).toBe("object");
        expect(pCategorize.settings.baseUrl).toEqual("http://localhost:9950");
        expect(pCategorize.settings.enabled).toEqual(false);
        expect(pCategorize.settings.cbError).toBeDefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeDefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filterChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual(
            "http://localhost:9950/test/search/categorize"
        );
    });

    it("Should be able to Categorize some results", () => {
        // tslint:disable-next-line:no-require-imports
        const categories: Categories = require("../test-data/categories.json");
        fetch.resetMocks();
        fetch.mockResponse(JSON.stringify(categories));

        let settings = {
            baseUrl: "http://localhost:9950/",
            cbRequest: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
            }),
            cbSuccess: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
            })
        } as ICategorizeSettings;

        let categorize = new Categorize(settings, null, fetch);
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
                expect(settings.cbSuccess).toHaveBeenCalled();
            });
    });

    it("Should be able to stop a Categorize using cbRequest", () => {
        // Not caring about the response, just to allow the fetch to complete.
        fetch.mockResponse(JSON.stringify({}));
        let settings = {
            baseUrl: "http://localhost:9950/",
            cbRequest: jest.fn((url, reqInit) => {
                expect(typeof url).toBe("string");
                expect(typeof reqInit).toBe("object");
                // Stop the request
                return false;
            }),
            cbSuccess: jest.fn()
        } as ICategorizeSettings;

        let categorize = new Categorize(settings, null, fetch);
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
                expect(settings.cbSuccess).not.toHaveBeenCalled();
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
            baseUrl: "http://localhost:9950/",
            cbRequest: jest.fn(() => false)
        };

        let client = new Categorize(settings);
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
        let query = new Query({
            clientCategoryFilter: {
                System: /---/,
                ModifiedDate: /---/,
                Author: /---/,
                FileType: /Word/
            }
        });

        let results: Categories = pClient.filterCategories(workCopy, query);

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

        let query = new Query({
            clientCategoryExpansion: {
                "System|File": true,
                "System|File|Testdata": true,
                "System|File|Testdata|Norway": true
            }
        });

        let results: Categories = pClient.filterCategories(workCopy, query);

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

    it("Should be able to finc category-nodes", () => {
        // tslint:disable-next-line:no-require-imports
        let categories: Categories = require("../test-data/categories.json");
        sanityCheck(categories);

        let client = new Categorize("http://localhost:9950/");
        let pClient = client as any;

        expect(typeof pClient.findCategory).toBe("function");
        let match = client.findCategory(["System", "File"], categories);
        expect(match).not.toBeNull();
        match = client.findCategory(["System", "File"], categories);
        expect(match).not.toBeNull();
    });

    it("Should be able to add missing filters as category-tree nodes", () => {
        // tslint:disable-next-line:no-require-imports
        let categories: Categories = require("../test-data/categories.json");
        sanityCheck(categories);

        let client = new Categorize("http://localhost:9950/");
        let pClient = client as any;
        //client.categories = workCopy;

        expect(typeof pClient.addFiltersIfMissing).toBe("function");

        let category = {
            categoryName: ["group", "child"],
            children: [],
            displayName: "Child",
            name: "child"
        } as Category;

        let filter = new Filter(["Group", "Child"], category);
        expect(filter.category).toEqual(category);

        pClient.addFiltersIfMissing([filter], categories);
        expect(categories.groups.length).toEqual(5);
        expect(categories.groups[4].displayName).toEqual("Group");
        expect(categories.groups[4].expanded).toEqual(true);
        expect(categories.groups[4].name).toEqual("group");
        expect(categories.groups[4].categories.length).toEqual(1);
        expect(categories.groups[4].categories[0].categoryName).toEqual([
            "group",
            "child"
        ]);
        expect(categories.groups[4].categories[0].count).toEqual(0);
        expect(categories.groups[4].categories[0].displayName).toEqual("Child");
        expect(categories.groups[4].categories[0].expanded).toEqual(false);
        expect(categories.groups[4].categories[0].name).toEqual("child");
        expect(categories.groups[4].categories[0].children.length).toEqual(0);

        // Add the same category again, should not add anything
        pClient.addFiltersIfMissing([filter], categories);
        expect(categories.groups.length).toEqual(5);
        expect(categories.groups[4].displayName).toEqual("Group");
        expect(categories.groups[4].expanded).toEqual(true);
        expect(categories.groups[4].name).toEqual("group");
        expect(categories.groups[4].categories.length).toEqual(1);
        expect(categories.groups[4].categories[0].categoryName).toEqual([
            "group",
            "child"
        ]);
        expect(categories.groups[4].categories[0].count).toEqual(0);
        expect(categories.groups[4].categories[0].displayName).toEqual("Child");
        expect(categories.groups[4].categories[0].expanded).toEqual(false);
        expect(categories.groups[4].categories[0].name).toEqual("child");
        expect(categories.groups[4].categories[0].children.length).toEqual(0);

        // Add deeper node
        category = {
            categoryName: ["group", "child", "leaf"],
            children: [],
            displayName: "Leaf",
            name: "leaf"
        } as Category;

        filter = new Filter(["Group", "Child", "Leaf"], category);
        pClient.addFiltersIfMissing([filter], categories);
        expect(categories.groups.length).toEqual(5);
        expect(categories.groups[4].displayName).toEqual("Group");
        expect(categories.groups[4].expanded).toEqual(true);
        expect(categories.groups[4].name).toEqual("group");

        expect(categories.groups[4].categories.length).toEqual(1);
        expect(categories.groups[4].categories[0].categoryName).toEqual([
            "group",
            "child"
        ]);
        expect(categories.groups[4].categories[0].count).toEqual(0);
        expect(categories.groups[4].categories[0].displayName).toEqual("Child");
        expect(categories.groups[4].categories[0].expanded).toEqual(true);
        expect(categories.groups[4].categories[0].name).toEqual("child");

        expect(categories.groups[4].categories[0].children.length).toEqual(1);
        expect(
            categories.groups[4].categories[0].children[0].categoryName
        ).toEqual(["group", "child", "leaf"]);
        expect(categories.groups[4].categories[0].children[0].count).toEqual(0);
        expect(
            categories.groups[4].categories[0].children[0].displayName
        ).toEqual("Leaf");
        expect(categories.groups[4].categories[0].children[0].expanded).toEqual(
            false
        );
        expect(categories.groups[4].categories[0].children[0].name).toEqual(
            "leaf"
        );

        expect(
            categories.groups[4].categories[0].children[0].children.length
        ).toEqual(0);

        // Add missing on empty categories result
        let emptyCategories = {
            errorMessage: null,
            extendedProperties: null,
            groups: [],
            isEstimatedCount: false,
            matchCount: 0,
            statusCode: 0
        } as Categories;

        pClient.addFiltersIfMissing([filter], emptyCategories);
        expect(emptyCategories.groups.length).toEqual(1);
        expect(emptyCategories.groups[0].displayName).toEqual("Group");
        expect(emptyCategories.groups[0].expanded).toEqual(true);
        expect(emptyCategories.groups[0].name).toEqual("group");

        expect(emptyCategories.groups[0].categories.length).toEqual(1);
        expect(emptyCategories.groups[0].categories[0].categoryName).toEqual([
            "group",
            "child"
        ]);
        expect(emptyCategories.groups[0].categories[0].count).toEqual(0);
        expect(emptyCategories.groups[0].categories[0].displayName).toEqual(
            "Child"
        );
        expect(emptyCategories.groups[0].categories[0].expanded).toEqual(true);
        expect(emptyCategories.groups[0].categories[0].name).toEqual("child");

        expect(emptyCategories.groups[0].categories[0].children.length).toEqual(
            1
        );
        expect(
            emptyCategories.groups[0].categories[0].children[0].categoryName
        ).toEqual(["group", "child", "leaf"]);
        expect(
            emptyCategories.groups[0].categories[0].children[0].count
        ).toEqual(0);
        expect(
            emptyCategories.groups[0].categories[0].children[0].displayName
        ).toEqual("Leaf");
        expect(
            emptyCategories.groups[0].categories[0].children[0].expanded
        ).toEqual(false);
        expect(
            emptyCategories.groups[0].categories[0].children[0].name
        ).toEqual("leaf");

        expect(
            categories.groups[4].categories[0].children[0].children.length
        ).toEqual(0);
    });
});
