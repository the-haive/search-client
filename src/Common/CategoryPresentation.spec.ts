import {
    CategoryPresentation,
    CategoryPresentationMap,
    GroupingMode,
    SortPartConfiguration,
    SortMethod,
    MatchMode,
    Casing
} from "./CategoryPresentation";

import { Categorize } from "../../src/Categorize";
import { ICategories } from "../../src/Data";

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

describe("When managing a CategoryPresentations map it:", () => {
    it("Should be possible to create the map", () => {
        let map = {} as CategoryPresentationMap;
        expect(typeof map).toBe("object");
    });

    it("Should have expected default values", () => {
        let catPresDefault = new CategoryPresentation();

        expect(catPresDefault).toEqual({
            expanded: null,
            group: {
                enabled: false,
                minCount: 20,
                mode: GroupingMode.DisplayName,
                match: RegExp(/^./),
                matchCase: Casing.Title,
                minCountPerGroup: 5
            },
            filter: {
                enabled: false,
                match: RegExp(""),
                matchMode: MatchMode.DisplayName,
                maxMatchCount: -1,
                uiHintShowFilterInputThreshold: 20
            },
            sort: {
                enabled: false,
                parts: []
            },
            limit: {
                enabled: false,
                page: 1,
                pageSize: 5,
                uiHintShowPager: true
            }
        });
    });

    it("Should have expected valued for a default SortPart", () => {
        let sortPartDefault = new SortPartConfiguration();

        expect(typeof sortPartDefault).toBe("object");
        expect(sortPartDefault).toEqual({
            match: /.*/,
            matchMode: MatchMode.DisplayName,
            sortMethod: SortMethod.Original
        });
    });

    it("Should be possible to create a RegExp-based SortPart, without the input being mutated", () => {
        let re = /test/;
        let sortPart = new SortPartConfiguration({ match: re });

        expect(sortPart.match).toEqual(/test/);
        expect(sortPart.match).toBe(re); // Is the same object (not mutated)
    });
});

describe("When grouping a CategoryPresentations map it:", () => {
    it("Should be possible to group on root-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                __ROOT__: {
                    group: {
                        enabled: true,
                        minCount: 1,
                        minCountPerGroup: 2
                    }
                } as CategoryPresentation
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        console.log(results);
        expect(results.groups.length).toEqual(3);
        expect(results.groups[0].name).toEqual("System");
        expect(results.groups[1].name).toEqual("__F__");
        expect(results.groups[2].name).toEqual("ModifiedDate");
    });

    it("Should be possible to group on group-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                Author: {
                    group: {
                        enabled: true,
                        minCount: 1,
                        minCountPerGroup: 2
                    }
                } as CategoryPresentation
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);
        expect(results.groups.length).toEqual(4);
        expect(results.groups[1].name).toEqual("Author");
        expect(results.groups[1].categories.length).toEqual(14);
        expect(results.groups[1].categories[10].name).toEqual("__A__");
        expect(results.groups[1].categories[10].displayName).toEqual("A");
        expect(results.groups[1].categories[10].children.length).toEqual(2);
        expect(results.groups[1].categories[10].children[0].name).toEqual(
            "Astrid Øksenvåg"
        );
        expect(results.groups[1].categories[10].children[1].name).toEqual(
            "Allan Auke"
        );
    });

    it("Should be possible to group on category-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                "ModifiedDate|2007|Month": {
                    group: {
                        enabled: true,
                        minCount: 1,
                        minCountPerGroup: 2
                    }
                } as CategoryPresentation
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);
        expect(results.groups.length).toEqual(4);
        expect(results.groups[2].name).toEqual("ModifiedDate");
        expect(results.groups[2].categories.length).toEqual(3);
        expect(results.groups[2].categories[0].name).toEqual("2007");
        expect(results.groups[2].categories[0].children[0].name).toEqual(
            "Month"
        );
        expect(
            results.groups[2].categories[0].children[0].children[1].name
        ).toEqual("__M__");
        expect(
            results.groups[2].categories[0].children[0].children[1].children[0]
                .displayName
        ).toEqual("March");
        expect(
            results.groups[2].categories[0].children[0].children[1].children[1]
                .displayName
        ).toEqual("May");
    });
});

describe("When filtering a CategoryPresentations map it:", () => {
    it("Should be possible to filter on root-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                __ROOT__: {
                    filter: {
                        enabled: true,
                        match: /System/,
                        matchMode: "Name"
                    }
                } as CategoryPresentation
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results.groups.length).toEqual(1);
        expect(results.groups[0].name).toEqual("System");
        expect(results.groups[0].categories.length).toEqual(1);
    });

    it("Should be possible to filter on group-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                __ROOT__: {
                    filter: {
                        enabled: true,
                        match: /Author/,
                        matchMode: "Name"
                    }
                } as CategoryPresentation,
                Author: {
                    filter: {
                        enabled: true,
                        match: /Susanne Koch/,
                        matchMode: "Name"
                    }
                } as CategoryPresentation
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);
        expect(results.groups.length).toEqual(1);
        expect(results.groups[0].name).toEqual("Author");
        expect(results.groups[0].categories.length).toEqual(1);
        expect(results.groups[0].categories[0].name).toEqual("Susanne Koch");
    });

    it("Should be possible to filter on category-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                __ROOT__: {
                    filter: {
                        enabled: true,
                        match: /ModifiedDate/,
                        matchMode: "Name"
                    }
                } as CategoryPresentation,
                ModifiedDate: {
                    filter: {
                        enabled: true,
                        match: /2007/,
                        matchMode: "Name"
                    }
                } as CategoryPresentation,
                "ModifiedDate|2007": {
                    filter: {
                        enabled: true,
                        match: /Month/,
                        matchMode: "Name"
                    }
                } as CategoryPresentation,
                "ModifiedDate|2007|Month": {
                    filter: {
                        enabled: true,
                        match: /September/,
                        matchMode: "DisplayName"
                    }
                } as CategoryPresentation
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);
        expect(results.groups.length).toEqual(1);
        expect(results.groups[0].name).toEqual("ModifiedDate");
        expect(results.groups[0].categories.length).toEqual(1);
        expect(results.groups[0].categories[0].name).toEqual("2007");
        expect(results.groups[0].categories[0].children.length).toEqual(1);
        expect(results.groups[0].categories[0].children[0].name).toEqual(
            "Month"
        );
        expect(
            results.groups[0].categories[0].children[0].children.length
        ).toEqual(1);
        expect(
            results.groups[0].categories[0].children[0].children[0].displayName
        ).toEqual("September");
    });
});

describe("When sorting a CategoryPresentations map it:", () => {
    it("Should be possible to sort on root-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                __ROOT__: {
                    sort: {
                        enabled: true,
                        parts: [
                            {
                                match: /.*/,
                                matchMode: "DisplayName",
                                sortMethod: "AlphaDesc"
                            } as SortPartConfiguration,
                            {
                                match: "System",
                                matchMode: "Name"
                            } as SortPartConfiguration
                        ]
                    }
                } as CategoryPresentation,
                Author: {
                    sort: {
                        enabled: true
                    }
                }
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results.groups.length).toEqual(4);
        expect(results.groups[0].displayName).toEqual("Modified date");
        expect(results.groups[1].displayName).toEqual("Forfatter");
        expect(results.groups[2].displayName).toEqual("Filtype");
        expect(results.groups[3].name).toEqual("System");
    });

    it("Should be possible to sort on group-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                Author: {
                    sort: {
                        enabled: true,
                        parts: [
                            {
                                match: /^A.*/,
                                matchMode: "Name"
                            } as SortPartConfiguration,
                            {
                                match: /^L.*/i,
                                matchMode: "Name",
                                sortMethod: "CountDesc"
                            } as SortPartConfiguration,
                            {
                                match: "Olav Hansen",
                                matchMode: "Name",
                                sortMethod: "AlphaAsc"
                            } as SortPartConfiguration
                        ]
                    }
                }
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results.groups.length).toEqual(4);
        expect(results.groups[1].name).toEqual("Author");
        expect(results.groups[1].categories[0].name).toEqual("Astrid Øksenvåg");
        expect(results.groups[1].categories[1].name).toEqual("Allan Auke");
        expect(results.groups[1].categories[2].name).toEqual("lises");
        expect(results.groups[1].categories[3].name).toEqual("lkg");
        expect(results.groups[1].categories[4].name).toEqual("Lars Frode");
        expect(results.groups[1].categories[5].name).toEqual("Lars F.");
        expect(results.groups[1].categories[6].name).toEqual("Lise Sagdahl");
        expect(results.groups[1].categories[7].name).toEqual("Olav Hansen");
        expect(results.groups[1].categories[8].name).toEqual(
            "Bibliotek - Admin"
        );
        expect(results.groups[1].categories[9].name).toEqual(
            "Gro Merethe Johnsrud"
        );
        expect(results.groups[1].categories[10].name).toEqual("GESL");
    });

    it("Should be possible to sort on category-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                "ModifiedDate|2007|Month": {
                    sort: {
                        enabled: true,
                        parts: [
                            {
                                match: /^Dec.*/,
                                matchMode: "DisplayName"
                            } as SortPartConfiguration,
                            {
                                match: /^Sep.*/,
                                matchMode: "Name"
                            } as SortPartConfiguration,
                            {
                                match: /.*/,
                                matchMode: "Name",
                                sortMethod: "CountDesc"
                            } as SortPartConfiguration
                        ]
                    }
                }
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results.groups.length).toEqual(4);
        expect(results.groups[2].name).toEqual("ModifiedDate");
        expect(results.groups[2].categories[0].name).toEqual("2007");
        expect(results.groups[2].categories[0].children[0].name).toEqual(
            "Month"
        );
        expect(
            results.groups[2].categories[0].children[0].children[0].displayName
        ).toEqual("December");
        expect(
            results.groups[2].categories[0].children[0].children[1].displayName
        ).toEqual("September");
        expect(
            results.groups[2].categories[0].children[0].children[2].displayName
        ).toEqual("March");
        expect(
            results.groups[2].categories[0].children[0].children[2].count
        ).toBe(71);
        expect(
            results.groups[2].categories[0].children[0].children[3].displayName
        ).toEqual("May");
        expect(
            results.groups[2].categories[0].children[0].children[3].count
        ).toBe(71);
        expect(
            results.groups[2].categories[0].children[0].children[4].displayName
        ).toEqual("October");
        expect(
            results.groups[2].categories[0].children[0].children[4].count
        ).toBe(27);
    });
});

describe("When limiting a CategoryPresentations map it:", () => {
    it("Should be possible to limit on root-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                __ROOT__: {
                    limit: {
                        enabled: true,
                        pageSize: 2
                    }
                }
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results.groups.length).toEqual(2);
    });

    it("Should be possible to limit on group-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                Author: {
                    limit: {
                        enabled: true,
                        pageSize: 2
                    }
                }
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results.groups.length).toEqual(4);
        expect(results.groups[1].name).toEqual("Author");
        expect(results.groups[1].categories.length).toEqual(2);
    });

    it("Should be possible to limit on category-level", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize({
            baseUrl: "http://localhost:9950/",
            presentations: {
                "ModifiedDate|2014": {
                    limit: {
                        enabled: true,
                        pageSize: 2
                    }
                }
            }
        });

        let pClient = client as any;

        let results: ICategories = pClient.filterCategories(workCopy);

        sanityCheck(workCopy);

        expect(results.groups.length).toEqual(4);
        expect(results.groups[2].name).toEqual("ModifiedDate");
        expect(results.groups[2].categories[1].name).toEqual("2014");
        expect(results.groups[2].categories[1].children.length).toEqual(2);
        expect(results.groups[2].categories[2].children[0].name).toEqual(
            "Month"
        );
    });
});

describe("When managing expanded state for CategoryPresentation nodes it:", () => {
    it("Should be possible to toggle expanded state on a group and category node", () => {
        // tslint:disable-next-line:no-require-imports
        let workCopy: ICategories = require("../test-data/categories.json");
        sanityCheck(workCopy);

        let client = new Categorize("http://localhost:9950/");
        let pClient = client as any;

        // Expect - before
        expect(workCopy.groups[0].name).toEqual("System");
        expect(workCopy.groups[0].expanded).toBeTruthy();
        expect(workCopy.groups[0].categories[0].name).toEqual("File");
        expect(workCopy.groups[0].categories[0].expanded).toBeFalsy();
        expect(workCopy.groups[0].categories[0].children[0].name).toEqual(
            "Testdata"
        );
        expect(
            workCopy.groups[0].categories[0].children[0].expanded
        ).toBeFalsy();
        expect(
            workCopy.groups[0].categories[0].children[0].children[0].name
        ).toEqual("Norway");
        expect(
            workCopy.groups[0].categories[0].children[0].children[0].expanded
        ).toBeFalsy();

        client.settings.presentations = {
            "System|File": {
                expanded: true
            } as CategoryPresentation,
            "System|File|Testdata": {
                expanded: true
            } as CategoryPresentation,
            "System|File|Testdata|Norway": {
                expanded: true
            } as CategoryPresentation
        };
        //console.log(client.settings);

        let results: ICategories = pClient.filterCategories(workCopy);

        // Expect - after
        expect(results.groups[0].name).toEqual("System");
        expect(results.groups[0].expanded).toBeTruthy();
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
