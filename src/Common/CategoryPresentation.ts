/**
 * Defines a dictionary type for mapping CategoryPresentation objects using a string, typically a
 * pipe-concatenated list of categoryNames as a string.
 */
export type CategoryPresentationMap = {
    [categoryNames: string]: CategoryPresentation;
};

/**
 * The configuration describes how the specific node is to be filtered, sorted, and/or grouped.
 * Applied in this order:
 * - grouping: Grouping might change all items on this level (introduces an extra layer).
 *             If an extra group-level is introduced then it will be subject for all
 *             consecutive processes in this class.
 * - filter: Reduces which child-categories that passes through based on filter.
 * - sorting: Changes the order of the categories.
 * - limit: Limits the no of categories to display.
 * - expanded: If any categories are left to be shown then this setting indicates whether or not
 *             to show the categories in the UI. Note that this is not available for the root-
 *             level node, as it always shows the first-level of category-nodes.
 *
 * @default - All features disabled.
 */
export class CategoryPresentation {
    /**
     * Used to create an extra level of categories that group items together. Default: Disabled
     */
    public group?: GroupConfiguration;

    /**
     * Used to include only categories that match the provided filter (regex + minCount). Default: Disabled
     */
    public filter?: FilterConfiguration;

    /**
     * Used to change the order of the categories. Default: Disabled
     */
    public sort?: SortConfiguration;

    /**
     * Used to limit the number of items to display. Default: Disabled
     */
    public limit?: LimitPageConfiguration;

    /**
     * Used to indicate whether tho show category-children or not. Default: undefined (N/A for the root-element)
     */
    public expanded?: boolean | null;

    /**
     * Creates a CategoryPresentation instance. Default: All features disabled.
     * @param settings A CategoryPresentation object describing the behavior
     */
    constructor(settings?: CategoryPresentation) {
        settings = settings || ({} as CategoryPresentation);
        this.expanded =
            typeof settings.expanded !== "undefined" ? settings.expanded : null;
        this.group = new GroupConfiguration(settings.group);
        this.filter = new FilterConfiguration(settings.filter);
        this.sort = new SortConfiguration(settings.sort);
        this.limit = new LimitPageConfiguration(settings.limit);
    }
}

/**
 * Defines how grouping is to be applied on a given categories' children
 * Can be set to only be executed when the number of child-categories exceeds a given number.
 */
export class GroupConfiguration {
    /**
     * Enables or disables the feature. Default: false
     */
    public enabled?: boolean;

    /**
     * Only applies grouping when the number of children reaches this number. Default: 20
     */
    public minCount?: number;

    /**
     * DisplayName or MatchCount. Default: GroupingMode.DisplayName.
     */
    public mode?: GroupingMode;

    /**
     * The regex to group on. Default: Matches first character /^./
     */
    public match?: RegExp;

    /**
     * The casing to apply on the match group ($0). Default: Casing.Title
     */
    public matchCase?: Casing;

    /**
     * Only creates the group when number of matches per group reaches this number. Default: 5
     */
    public minCountPerGroup?: number;

    /**
     * Creates a GroupingConfiguration instance.
     *
     * @param settings A GroupingPresentation object describing the behavior.
     */
    constructor(settings?: GroupConfiguration) {
        settings = settings || ({} as GroupConfiguration);
        this.enabled =
            typeof settings.enabled !== "undefined" ? settings.enabled : false;
        this.minCount =
            typeof settings.minCount !== "undefined" ? settings.minCount : 20;
        this.mode =
            typeof settings.mode !== "undefined"
                ? (settings.mode as GroupingMode)
                : GroupingMode.DisplayName;
        this.match =
            typeof settings.match !== "undefined"
                ? typeof settings.match === "string"
                    ? new RegExp(settings.match)
                    : settings.match
                : /^./;
        this.matchCase =
            typeof settings.matchCase !== "undefined"
                ? (settings.matchCase as Casing)
                : Casing.Title;

        this.minCountPerGroup =
            typeof settings.minCountPerGroup !== "undefined"
                ? settings.minCountPerGroup
                : 5;
    }

    public getMatch?(input: string): string {
        let test = this.match.exec(input);
        if (test === null) {
            return null;
        }
        switch (this.matchCase) {
            case Casing.Lower:
                return test[0].toLowerCase();
            case Casing.Upper:
                return test[0].toUpperCase();
            case Casing.Title:
                return (
                    test[0][0].toUpperCase() +
                    test[0].substring(1).toLowerCase()
                );
            case Casing.Unchanged:
            default:
                return test[0];
        }
    }
}

export enum GroupingMode {
    DisplayName = "DisplayName",
    MatchCount = "MatchCount"
}

export enum Casing {
    Unchanged = "Unchanged",
    Upper = "Upper", // UPPER
    Lower = "Lower", // lower
    Title = "Title" // Title
}

/**
 * Defines how to filter items.
 */
export class FilterConfiguration {
    /**
     * Enables or disables the feature. Default: false
     */
    public enabled?: boolean;

    /**
     * The current regex match filter, applied on the Name or DisplayName (see matchMode). Default: "" (empty - no matches)
     */
    public match?: RegExp;

    /**
     * The current match-mode for the regex filter. Default: DisplayName
     */
    public matchMode?: MatchMode;

    /**
     * The maximum no of matches for the category to be included. Default: -1 (disabled)
     */
    public maxMatchCount?: number;

    /**
     * Hints the UI to show an input box when the number of hits exceeds a given number. Default: 20
     */
    public uiHintShowFilterInputThreshold?: number;

    /**
     * Creates a FilterConfiguration instance that describes how to filter categories.
     *
     * @param settings A FilterConfiguration object describing the behavior
     */
    constructor(settings?: FilterConfiguration) {
        settings = settings || ({} as FilterConfiguration);

        this.enabled =
            typeof settings.enabled !== "undefined" ? settings.enabled : false;

        this.match =
            typeof settings.match !== "undefined"
                ? typeof settings.match === "string"
                    ? new RegExp(settings.match)
                    : settings.match
                : new RegExp("");

        this.matchMode =
            typeof settings.matchMode !== "undefined"
                ? (settings.matchMode as MatchMode)
                : MatchMode.DisplayName;

        this.maxMatchCount =
            typeof settings.maxMatchCount !== "undefined"
                ? settings.maxMatchCount
                : -1; // disabled

        this.uiHintShowFilterInputThreshold =
            typeof settings.uiHintShowFilterInputThreshold !== "undefined"
                ? settings.uiHintShowFilterInputThreshold
                : 20;
    }
}

export enum MatchMode {
    Name = "Name",
    DisplayName = "DisplayName"
}

/**
 * Defines how sorting is to be applied.
 * First handles the static strings, then applies the SortPartConfigurations until there are no items left.
 * Note: If there are additional items left when done above then these will be added at the bottom in the original sorting order.
 */
export class SortConfiguration {
    /**
     *
     */
    public enabled?: boolean;

    /**
     *
     */
    public parts?: SortPartConfiguration[];

    /**
     * Creates a sort-configuration that defines how to order the items scoped.
     *
     * @param settings A SortConfiguration object that describes the wanted behavior
     */
    constructor(settings?: SortConfiguration) {
        settings = settings || ({} as SortConfiguration);

        this.enabled =
            typeof settings.enabled !== "undefined" ? settings.enabled : false;

        this.parts =
            typeof settings.parts !== "undefined"
                ? this.setupParts(settings.parts)
                : [];
    }

    private setupParts?(parts: SortPartConfiguration[]) {
        let ok: SortPartConfiguration[] = [];
        for (let s of parts) {
            ok.push(new SortPartConfiguration(s));
        }
        return ok;
    }
}

/**
 * Defines how sorting is to be applied for the given part.
 */
export class SortPartConfiguration {
    /**
     * Defines the match (string or regex) that defines the scope of items to sort. Default: ".*" (anything)
     */
    public match?: RegExp | string;

    /**
     * The current match-mode for the regex filter. Default: DisplayName
     */
    public matchMode?: MatchMode;

    /**
     * Defines the method/field and order to use when sorting. Default: Original
     */
    public sortMethod?: SortMethod;
    /**
     * Creates a sort-part that defines how to order the items scoped.
     *
     * @param settings A SortPartConfiguration object that describes the wanted behavior
     */
    constructor(settings?: SortPartConfiguration) {
        settings = settings || ({} as SortPartConfiguration);

        this.match =
            typeof settings.match !== "undefined" ? settings.match : /.*/;

        this.matchMode =
            typeof settings.matchMode !== "undefined"
                ? (settings.matchMode as MatchMode)
                : MatchMode.DisplayName;

        this.sortMethod =
            typeof settings.sortMethod !== "undefined"
                ? (settings.sortMethod as SortMethod)
                : SortMethod.Original;
    }
}

/**
 * Defines how to sort the part.
 *
 */
export enum SortMethod {
    /**
     * Sort in the order received from the server.
     */
    Original = "Original",

    /**
     * Sort Ascending by Name/DisplayName field.
     */
    AlphaAsc = "AlphaAsc",

    /**
     * Sort Descending by Name/DisplayName field.
     */
    AlphaDesc = "AlphaDesc",

    /**
     * Sort Ascending by MatchCount field.
     */
    CountAsc = "CountAsc",

    /**
     * Sort Descending by MatchCount field.
     */
    CountDesc = "CountDesc"
}

/**
 * Defines paging parameters for controlling which range of items to show.
 * Used to limit the number of items to display.
 * The regular use-case is to set a pageSize, which acts as the number of items to show.
 * The limit is also designed to allow paging, by changing page from 1 and thus allowing
 * paging the categories.
 */
export class LimitPageConfiguration {
    /**
     * Enables or disables the feature. Default: false
     */
    public enabled?: boolean;

    /**
     * Defines the page to show. Default: 1
     */
    public page?: number;

    /**
     * Defines the pageSize that with the `page` controls which item-range to show. Default: 5
     */
    public pageSize?: number;

    /**
     * Hints the ui to show a pager to allow browsing the categories in the node. Default: true
     */
    public uiHintShowPager?: boolean;

    /**
     * Creates a LimitPageConfiguration instance. Default: Show first page, with 5 items.
     *
     * @param settings A LimitPageConfiguration object that describes the wanted behavior
     */
    constructor(settings?: LimitPageConfiguration) {
        settings = settings || ({} as LimitPageConfiguration);

        this.enabled =
            typeof settings.enabled !== "undefined" ? settings.enabled : false;

        this.page = typeof settings.page !== "undefined" ? settings.page : 1;

        function setPageSizeThrowOnNegative() {
            if (settings.pageSize < 0) {
                throw new Error("limit pageSize cannot be negative");
                return 0;
            } else {
                return settings.pageSize;
            }
        }
        this.pageSize =
            typeof settings.pageSize !== "undefined"
                ? setPageSizeThrowOnNegative()
                : 5;

        this.uiHintShowPager =
            typeof settings.uiHintShowPager !== "undefined"
                ? settings.uiHintShowPager
                : true;
    }
}
