import {FetchMock} from "jest-fetch-mock";
const fetchMock = fetch as FetchMock;
import {    
    HapiCategorize,
    CategorizeSettings,
    ICategorizeSettings,
    CategorizeTriggers
} from ".";
import { ICategory, ICategories } from "../Data";
import { Filter, IQuery } from "../Common";
import merge from 'deepmerge';

import { categoriesResponse } from "../test-data/hapi-categories";

import reference from "../test-data/categories.json";
Object.freeze(reference);
const catRef = reference as ICategories;

let spyConsoleWarn: any;
beforeAll(() => {
    // Create a spy on console (console.log in this case) and provide some mocked implementation
    // In mocking global objects it's usually better than simple `jest.fn()`
    // because you can `unmock` it in clean way doing `mockRestore`
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
afterAll(() => {
    // Restore mock after all tests are done, so it won't affect other test suites
    spyConsoleWarn.mockRestore();
  });
afterEach(() => {
    // Clear mock (all calls etc) after each test.
    // It's needed when you're using console somewhere in the tests so you have clean mock each time
    spyConsoleWarn.mockClear();
  });

function sanityCheck(categories: ICategories) {
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
        expect(typeof HapiCategorize).toBe("function");
    });

    it("Should be able to create Categorize instance", () => {
        let categorize = new HapiCategorize("http://localhost:9950/");
        let pCategorize = categorize as any;

        expect(typeof categorize).toBe("object");
        expect(categorize instanceof HapiCategorize).toBeTruthy();
        expect(pCategorize.settings.enabled).toEqual(true);
        expect(pCategorize.settings.cbError).toBeUndefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeUndefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filtersChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual(
            "http://localhost:9950/RestService/v4/search/categorize"
        );
    });

    it("Should not throw, even for invalid urls. Not perfect, but avoids an additional dependency.", () => {
        expect(() => {
            let categorize = new HapiCategorize("file://localhost:9950");
            expect(typeof categorize).toBe("object");
        }).not.toThrow();

        expect(() => {
            let categorize = new HapiCategorize("http:+//localhost:9950");
            expect(typeof categorize).toBe("object");
        }).not.toThrow();
    });

    it("Should be able to pass a default CategorizeSettings instance", () => {
        let categorize = new HapiCategorize("http://localhost:9950/");
        let pCategorize = categorize as any;

        expect(typeof pCategorize.auth).toBe("object");
        expect(pCategorize.settings.enabled).toEqual(true);
        expect(pCategorize.settings.cbError).toBeUndefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeUndefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filtersChanged).toEqual(true);
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

        let categorize = new HapiCategorize(settings);
        let pCategorize = categorize as any;

        expect(typeof pCategorize.auth).toBe("object");
        expect(pCategorize.settings.baseUrl).toEqual("http://localhost:9950");
        expect(pCategorize.settings.enabled).toEqual(false);
        expect(pCategorize.settings.cbError).toBeDefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeDefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filtersChanged).toEqual(true);
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
            cbSuccess: (data: ICategories) => {
                /* dummy */
            },
            enabled: false,
            triggers: new CategorizeTriggers(),
            basePath: "/test"
        } as ICategorizeSettings;

        let categorize = new HapiCategorize(settings);
        let pCategorize = categorize as any;

        expect(typeof pCategorize.auth).toBe("object");
        expect(pCategorize.settings.baseUrl).toEqual("http://localhost:9950");
        expect(pCategorize.settings.enabled).toEqual(false);
        expect(pCategorize.settings.cbError).toBeDefined();
        expect(pCategorize.settings.cbRequest).toBeUndefined();
        expect(pCategorize.settings.cbSuccess).toBeDefined();
        expect(pCategorize.settings.triggers).toBeDefined();
        expect(pCategorize.settings.triggers.filtersChanged).toEqual(true);
        expect(pCategorize.settings.url).toEqual(
            "http://localhost:9950/test/search/categorize"
        );
    });

    it("Should be able to Categorize some results", async () => {        
        fetchMock.mockResponse(
            JSON.stringify(categoriesResponse),
            { 
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        let cbRequest = jest.fn((url, reqInit) => {
            expect(typeof url).toBe("string");
            expect(typeof reqInit).toBe("object");
        }) as unknown;
        let cbSuccess = jest.fn((data) => {
            expect(typeof data).toBe("object");
        }) as unknown;

        let settings = {
            baseUrl: "http://localhost:9950/",
            cbRequest,
            cbSuccess
        } as ICategorizeSettings;

        let categorize = new HapiCategorize(settings, null, fetch);
        try {
            const response = await categorize.fetch();
            expect(typeof response).toBe("object");
            expect(response.groups.length).toEqual(3);
        } catch (error) {
            fail("Should not fail");
        }
        expect(settings.cbRequest).toHaveBeenCalled();
        expect(settings.cbSuccess).toHaveBeenCalled();
    });

    it("Should be able to stop a Categorize using cbRequest", async () => {
        // Not caring about the response, just to allow the fetch to complete.
        fetchMock.mockResponse(JSON.stringify({}));
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

        let categorize = new HapiCategorize(settings, null, fetch);
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
        expect(settings.cbRequest).toHaveBeenCalled();
        expect(settings.cbSuccess).not.toHaveBeenCalled();
    });

    it("Should have no effect when there are no filters defined", () => {
        let categories = merge({}, catRef) as ICategories;

        let client = new HapiCategorize("http://localhost:9950/");
        let pClient = client as any;

        // Expect no change, when no filter is added and running the filter method
        let results: ICategories = pClient.filterCategories(categories);

        sanityCheck(categories);

        expect(results).toEqual(catRef);
    });

    it("Should have no effect when filters are empty", () => {
        let categories = merge({}, catRef) as ICategories;

        let client = new HapiCategorize("http://localhost:9950/");
        let pClient = client as any;

        // Expect no change when filters are set manually
        pClient.clientCategoryFilter = [];

        let results: ICategories = pClient.filterCategories(categories);

        sanityCheck(categories);

        expect(results).toEqual(catRef);
    });

    it("Should have no effect when the filter is null", () => {
        let categories = merge({}, catRef) as ICategories;

        let client = new HapiCategorize("http://localhost:9950/");
        let pClient = client as any;
        // Expect no change when filters are set to null
        pClient.clientCategoryFilter = null;

        let results: ICategories = pClient.filterCategories(categories);

        sanityCheck(categories);

        expect(results).toEqual(catRef);
    });

    it("Should have no effect when the filter is undefined", () => {
        let categories: ICategories = merge({}, catRef) as ICategories;

        let client = new HapiCategorize("http://localhost:9950/");
        let pClient = client as any;

        // Expect no change when filters are set to null
        pClient.clientCategoryFilter = undefined;

        let results: ICategories = pClient.filterCategories(categories);

        sanityCheck(categories);

        expect(results).toEqual(catRef);
    });

    it("Should have no effect when the filter only has null-filters", () => {
        let categories = merge({}, catRef) as ICategories;

        let settings = {
            baseUrl: "http://localhost:9950/",
            cbRequest: jest.fn(() => false)
        };

        let client = new HapiCategorize(settings);
        let pClient = client as any;

        // Expect no change when filters are set to null
        pClient.clientCategoryFilter = [[null, null]];

        let results: ICategories = pClient.filterCategories(categories, {
            filters: []
        });

        sanityCheck(categories);

        expect(settings.cbRequest).toHaveBeenCalledTimes(0);
        expect(results).toEqual(catRef);
    });

    it("Should be possible to use the createCategoryFilter method to create filters, with string[] input", () => {
        let categorize = new HapiCategorize("http://localhost:9950");
        categorize.categories = merge({}, catRef) as ICategories;
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
        let categorize = new HapiCategorize("http://localhost:9950");
        categorize.categories = merge({}, catRef) as ICategories;
        const filterSystemFile = categorize.createCategoryFilter(
            categorize.categories.groups[0].categories[0].children[0].children[0]
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
            categorize.categories.groups[1].categories[18]
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
            categorize.categories.groups[3].categories[0]
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

    it("Should be able to find category-nodes", () => {
        let categories = merge({}, catRef) as ICategories;

        let client = new HapiCategorize("http://localhost:9950/");
        let pClient = client as any;

        expect(typeof pClient.findCategory).toBe("function");
        let match = client.findCategory(["System", "File"], categories);
        expect(match).not.toBeNull();
        match = client.findCategory(["System", "File"], categories);
        expect(match).not.toBeNull();
    });

    it("Should be able to add missing filters as category-tree nodes", () => {
        let categories = merge({}, catRef) as ICategories;

        let client = new HapiCategorize("http://localhost:9950/");
        let pClient = client as any;
        
        expect(typeof pClient.addFiltersInTreeIfMissing).toBe("function");

        let category = {
            categoryName: ["group", "child"],
            children: [],
            displayName: "Child",
            name: "child"
        } as ICategory;

        let filter = new Filter(["Group", "Child"], category);
        expect(filter.category).toEqual(category);

        pClient.addFiltersInTreeIfMissing([filter], categories);
        sanityCheck(catRef);
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
        pClient.addFiltersInTreeIfMissing([filter], categories);
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
        } as ICategory;

        filter = new Filter(["Group", "Child", "Leaf"], category);
        pClient.addFiltersInTreeIfMissing([filter], categories);
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
        } as ICategories;

        pClient.addFiltersInTreeIfMissing([filter], emptyCategories);
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

        // Remove the category node that has been added, to not make other tests fail.
        categories.groups = categories.groups.filter(g => g.name !== "group");
    });

    it("Calls both cbSuccess and cbWarning when results indicate error via statusCode", async () => {

        let response = {
            data: {
              index: {
                categories: {
                  errorMessage: "Categorize warning",
                  isEstimatedCount: false,
                  matchCount: 1,
                  statusCode: 1,
                  results: [
                    {
                      categoryName: "Document",
                      categoryDisplayName: "Document",
                      groupName: "FileType",
                      groupDisplayName: "File type",
                      path: [
                        "FileType",
                        "Document"
                      ],
                      itemsCount: 1
                    },
                    {
                      categoryName: "Doc",
                      categoryDisplayName: "Doc",
                      groupName: "FileType",
                      groupDisplayName: "File type",
                      path: [
                        "FileType",
                        "Document",
                        "Doc"
                      ],
                      itemsCount: 1
                    },
                    {
                      categoryName: "2020",
                      categoryDisplayName: "2020",
                      groupName: "Date",
                      groupDisplayName: "Date",
                      path: [
                        "Date",
                        "2020"
                      ],
                      itemsCount: 1
                    },
                    {
                      categoryName: "4",
                      categoryDisplayName: "April",
                      groupName: "Date",
                      groupDisplayName: "Date",
                      path: [
                        "Date",
                        "2020",
                        "4"
                      ],
                      itemsCount: 1
                    },
                    {
                      categoryName: "Engineering",
                      categoryDisplayName: "Engineering",
                      groupName: "Topic",
                      groupDisplayName: "Topic",
                      path: [
                        "Topic",
                        "Engineering"
                      ],
                      itemsCount: 1
                    }
                  ]
                }
              }
            }
          };

        fetchMock.mockResponse(
            JSON.stringify(response),
            { 
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        let cbError = jest.fn((error) => {
            fail("Should not fail");
        });

        let cbWarning = jest.fn((warning) => {
            expect(typeof warning).toBe("object");
            expect(warning.statusCode).toBe(1);
            expect(warning.message).toBe("Categorize warning");
        });

        let cbSuccess = jest.fn((results) => {
            expect(typeof results).toBe("object");
        });

        let settings = {
            baseUrl: "http://localhost:9950/",
            cbError,
            cbWarning,
            cbSuccess
        } as ICategorizeSettings;

        let categorize = new HapiCategorize(settings, null, fetch);
        try {
            await categorize.fetch();
        } catch (error) {
            fail("Should not fail");
        }
        expect(settings.cbError).toHaveBeenCalledTimes(0);
        expect(settings.cbWarning).toHaveBeenCalledTimes(1);
        expect(settings.cbSuccess).toHaveBeenCalledTimes(1);
    });
});

describe("Handle filters in the query-settings", () => {
    it("handle non-hidden filters in categories that already contains the filter", () => {
        // Arrange - When adding a non-hidden filter, the category-tree should contain the category-node that corresponds to this filter.
        let query: IQuery = {
            filters: [
                { category: { categoryName: ["System", "File"] } }
            ]
        };

        const categorize = new HapiCategorize("http://localhost:9950");
        let categories = merge({}, catRef) as ICategories;
        expect(categories.groups.length).toEqual(4);
        expect(categories.groups[0].categories.length).toEqual(1);

        // Act - process received categories, with the query-settings
        categories = (categorize as any).filterCategories(categories, query);

        // Assert - Since the filter only contains categories that is in the categories, no change should occur
        expect(categories.groups.length).toEqual(4);
        expect(categories.groups[0].categories.length).toEqual(1);
    });

    it("handle non-hidden filters in categories that does not already contain the filter", () => {
        // Arrange - When adding a non-hidden filter, the category-tree should contain the category-node that corresponds to this filter.
        let query: IQuery = {
            filters: [
                { category: { categoryName: ["NewGroup", "NewCategory"] } }
            ]
        };

        const categorize = new HapiCategorize("http://localhost:9950");
        let categories = merge({}, catRef) as ICategories;
        expect(categories.groups.length).toEqual(4);
        expect(categories.groups[0].categories.length).toEqual(1);

        // Act - process received categories, with the query-settings
        categories = (categorize as any).filterCategories(categories, query);

        // Assert - Since the filter contains new groups/categories then these are added to the tree
        expect(categories.groups.length).toEqual(5);
        expect(categories.groups[0].categories.length).toEqual(1);
        expect(categories.groups[4].categories.length).toEqual(1);
        expect(categories.groups[4].categories[0].categoryName).toEqual(query.filters[0].category.categoryName);
    });

    it("handle hidden filters in categories that already contains the filter", () => {

        // Arrange - When adding a hidden filter, any category that matches that filter is not be be displayed in the
        // category tree (as that would make it possible for the user to start manipulating the filter)
        let query: IQuery = {
                filters: [{ category: { categoryName: ["System", "File"] },
                hidden: true
            }]
        };

        const categorize = new HapiCategorize("http://localhost:9950");
        let categories = merge({}, catRef) as ICategories;
        expect(categories.groups.length).toEqual(4);
        expect(categories.groups[0].categories.length).toEqual(1);

        // Act - process received categories, with the query-settings
        categories = (categorize as any).filterCategories(categories, query);

        // Assert - The categories should no longer contain the "File" category within the "System" group (and, since System now has no more categories it too should be gone)
        expect(categories.groups.length).toEqual(3);
    });

    it("handle non-hidden filters in categories that does not already contain the filter", () => {
        // Arrange - When adding a hidden filter, any category that matches that filter is not be be displayed in the
        // category tree (as that would make it possible for the user to start manipulating the filter)
        let query: IQuery = {
            filters: [{
                category: { categoryName: ["NewGroup", "NewCategory"] },
                hidden: true
            }]
        };

        const categorize = new HapiCategorize("http://localhost:9950");
        let categories = merge({}, catRef) as ICategories;
        expect(categories.groups.length).toEqual(4);
        expect(categories.groups[0].categories.length).toEqual(1);

        // Act - process received categories, with the query-settings
        categories = (categorize as any).filterCategories(categories, query);

        // Assert - The categories should be the same as before (should not include the new Filter)
        expect(categories.groups.length).toEqual(4);
        expect(categories.groups[0].categories.length).toEqual(1);
    });
});
