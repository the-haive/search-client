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
     * Used to indicate whether tho show category-children or not. Default: false (N/A for the root-element)
     */
    public expanded?: boolean;

    /**
     * Used to create an extra level of categories that group items together. Default: Disabled
     */
    public grouping?: GroupingConfiguration;

    /**
     * Used to include only categories that match the provided filter (regex + minCount). Default: Disabled
     */
    public filter?: FilterConfiguration;

    /**
     * Used to change the order of the categories. Default: Disabled
     */
    public sorting?: SortingConfiguration;

    /**
     * Used to limit the number of items to display. Default: Disabled
     */
    public limit?: LimitPageConfiguration;

    /**
     * Creates a CategoryPresentation instance. Default: All features disabled.
     * @param settings A CategoryPresentation object describing the behavior
     */
    constructor(settings?: CategoryPresentation) {
        settings = settings || ({} as CategoryPresentation);
        this.expanded =
            typeof settings.expanded !== "undefined"
                ? settings.expanded
                : false;
        this.grouping = new GroupingConfiguration(settings.grouping);
        this.filter = new FilterConfiguration(settings.filter);
        this.sorting = new SortingConfiguration(settings.sorting);
        this.limit = new LimitPageConfiguration(settings.limit);
    }
}

/**
 * Defines how grouping is to be applied on a given categories' children
 * Can be set to only be executed when the number of child-categories exceeds a given number.
 */
export class GroupingConfiguration {
    /**
     * Enables or disables the feature. Default: false
     */
    public enabled?: boolean;

    /**
     * Only applies grouping when the number of children exceeds this number. Default: 20
     */
    public minCount?: number;

    /**
     * DisplayName or MatchCount. Default: DisplayName.
     */
    public mode?: GroupingMode;

    /**
     * The regex to group on. Default: Matches first character /^(.)/
     */
    public pattern?: RegExp;

    /**
     * The string to use as regex replace on. Default: Upper-cased match-group 1 from pattern "\U$1"
     */
    public replacement?: string;

    /**
     * Creates a GroupingConfiguration instance.
     *
     * @param settings A GroupingPresentation object describing the behavior.
     */
    constructor(settings?: GroupingConfiguration) {
        settings = settings || ({} as GroupingConfiguration);
        this.enabled =
            typeof settings.enabled !== "undefined" ? settings.enabled : false;
        this.minCount =
            typeof settings.minCount !== "undefined" ? settings.minCount : 20;
        this.mode =
            typeof settings.mode !== "undefined"
                ? (settings.mode as GroupingMode)
                : GroupingMode.DisplayName;
        this.pattern =
            typeof settings.pattern !== "undefined"
                ? typeof settings.pattern === "string"
                    ? new RegExp(settings.pattern)
                    : settings.pattern
                : /^(.)/;
        this.replacement =
            typeof settings.replacement !== "undefined"
                ? settings.replacement
                : "\\U$1";
    }
}

export enum GroupingMode {
    DisplayName = "DisplayName",
    MatchCount = "MatchCount"
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
     * The current regex match filter. Default: "" (empty - no matches)
     */
    public match: RegExp;

    /**
     * The maximum no of matches for the category to be included. Default: -1 (disabled)
     */
    public maxMatchCount: number;

    /**
     * Hints the UI to show an input box when the number of hits exceeds a given number. Default: 20
     */
    public uiHintShowFilterInputThreshold: number;

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

/**
 * Defines how sorting is to be applied.
 * First handles the static strings, then applies the SortPartConfigurations until there are no items left.
 * Note: If there are additional items left when done above then these will be added at the bottom in the original sorting order.
 */
export class SortingConfiguration {
    /**
     *
     */
    public enabled?: boolean;

    /**
     *
     */
    public parts?: SortPartConfigurationType[];

    /**
     * Creates a sort-configuration that defines how to order the items scoped.
     *
     * @param settings A SortConfiguration object that describes the wanted behavior
     */
    constructor(settings?: SortingConfiguration) {
        settings = settings || ({} as SortingConfiguration);

        this.enabled =
            typeof settings.enabled !== "undefined" ? settings.enabled : false;

        this.parts =
            typeof settings.parts !== "undefined"
                ? this.setupParts(settings.parts)
                : [];
    }

    private setupParts?(parts: SortPartConfigurationType[]) {
        let ok: SortPartConfigurationType[] = [];
        for (let s of parts) {
            if (typeof s === "string") {
                ok.push(s);
            } else {
                ok.push(new SortPartConfiguration(s));
            }
        }
        return ok;
    }
}

export type SortPartConfigurationType = string | SortPartConfiguration;

/**
 * Defines how sorting is to be applied for the given part.
 */
export class SortPartConfiguration {
    /**
     * Defines the match (string or regex) that defines the scope of items to sort. Default: ".*" (anything)
     */
    public match?: RegExp | string;

    /**
     * Defines the method/field and order to use when sorting. Default: Original
     */
    public method?: SortMethod;
    /**
     * Creates a sort-part that defines how to order the items scoped.
     *
     * @param settings A SortPartConfiguration object that describes the wanted behavior
     */
    constructor(settings?: SortPartConfiguration) {
        settings = settings || ({} as SortPartConfiguration);

        this.match =
            typeof settings.match !== "undefined"
                ? typeof settings.match === "string"
                    ? new RegExp(settings.match)
                    : settings.match
                : /.*/;

        this.method =
            typeof settings.method !== "undefined"
                ? (settings.method as SortMethod)
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
     * Sort Ascending by DisplayName field.
     */
    DisplayNameAsc = "DisplayNameAsc",

    /**
     * Sort Descending by DisplayName field.
     */
    DisplayNameDesc = "DisplayNameDesc",

    /**
     * Sort Ascending by MatchCount field.
     */
    MatchCountAsc = "MatchCountAsc",

    /**
     * Sort Descending by MatchCount field.
     */
    MatchCountDesc = "MatchCountDesc"
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
    public enabled: boolean;

    /**
     * Defines the page to show. Default: 1
     */
    public page: number;

    /**
     * Defines the pageSize that with the `page` controls which item-range to show. Default: 5
     */
    public pageSize: number;

    /**
     * Hints the ui to show a pager to allow browsing the categories in the node. Default: true
     */
    public uiHintShowPager: boolean;

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

        this.pageSize =
            typeof settings.pageSize !== "undefined" ? settings.pageSize : 5;

        this.uiHintShowPager =
            typeof settings.uiHintShowPager !== "undefined"
                ? settings.uiHintShowPager
                : true;
    }
}
