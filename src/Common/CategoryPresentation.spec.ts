// import { Category } from "../Data";
// import { Filter, OrderBy, Query, SearchType } from "../Common";
// import { CategorizeQueryConverter } from ".";

import {
    CategoryPresentation,
    CategoryPresentationMap,
    GroupingMode,
    SortPartConfiguration,
    SortMethod
} from "./CategoryPresentation";

describe("Can manage a map", () => {
    it("Should be able to create the map", () => {
        let map = {} as CategoryPresentationMap;
        expect(typeof map).toBe("object");
    });

    it("Should have expected default values for a CategoryPresentation object", () => {
        let catPresDefault = new CategoryPresentation();

        expect(catPresDefault).toEqual({
            expanded: false,
            grouping: {
                enabled: false,
                minCount: 20,
                mode: GroupingMode.DisplayName,
                pattern: RegExp(/^(.)/),
                replacement: "\\U$1"
            },
            filter: {
                enabled: false,
                match: RegExp(""),
                maxMatchCount: -1,
                uiHintShowFilterInputThreshold: 20
            },
            sorting: {
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
            method: SortMethod.Original
        });
    });

    it("Should be able to create a string-based SortPart, with the string converted to a RegExp on creation", () => {
        let re = "test";
        let sortPart = new SortPartConfiguration({ match: re });

        expect(sortPart.match).toEqual(/test/);
        expect(sortPart.match).not.toBe(re); // Has been mutated to regexp
    });

    it("Should be able to create a RegExp-based SortPart, without the input being mutated", () => {
        let re = /test/;
        let sortPart = new SortPartConfiguration({ match: re });

        expect(sortPart.match).toEqual(/test/);
        expect(sortPart.match).toBe(re); // Is the same object (not mutated)
    });
});
