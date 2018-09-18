/**
 * The configuration describes how the specific node is to be filtered, sorted, and/or grouped.
 * Applied in this order:
 * - grouping: Grouping might change all items on this level (introduces an extra layer).
 *             If an extra group-level is introduced then it will be subject for all
 *             consecutive processes in this class.
 * - filter: Reduces which child-categories that passes through based on filter.
 * - sort: Changes the order of the categories.
 * - limit: Limits the no of categories to display.
 * - expanded: If any categories are left to be shown then this setting indicates whether or not
 *             to show the categories in the UI. Note that this is not available for the root-
 *             level node, as it always shows the first-level of category-nodes.
 *
 * @default - All features disabled.
 */
export class CategoryPresentation {
    /**
     * Creates a CategoryPresentation instance. Default: All features disabled.
     *
     * @param expanded Used to indicate whether tho show category-children or not. Default: false (N/A for the root-element)
     * @param grouping Used to create an extra level of categories that group items together. Default: Disabled
     * @param filter Used to include only categories that match the provided filter (regex + minCount). Default: Disabled
     * @param sort  Used to change the order of the categories. Default: Disabled
     * @param limit Used to limit the number of items to display. Default: Disabled
     */
    constructor(
        public expanded: boolean = false,
        public grouping: GroupingConfiguration = new GroupingConfiguration(),
        public filter: FilterConfiguration = new FilterConfiguration(),
        public sort: SortConfiguration = new SortConfiguration(),
        public limit: LimitPageConfiguration = new LimitPageConfiguration()
    ) {}
}

/**
 * Defines how grouping is to be applied on a given categories' children
 * Can be set to only be executed when the number of child-categories exceeds a given number.
 */
export class GroupingConfiguration {
    /**
     * Creates a GroupingConfiguration instance.
     *
     * @param enabled Enables or disables the feature. Default: false
     * @param minCount Only applies grouping when the number of children exceeds this number. Default: 20;
     * @param mode DisplayName or MatchCount. Default: DisplayName.
     * @param pattern The regex to group on. Default: /^(.)/
     * @param replacement The string to use as regex replace on. Default: "\U$1"
     */
    constructor(
        public enabled: boolean = false,
        public minCount: number = 20,
        public mode: GroupingMode = GroupingMode.DisplayName,
        public pattern: RegExp = /^(.)/,
        public replacement: string = "\\U$1"
    ) {}
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
     * @param enabled Enables or disables the feature. Default: false
     * @param match The current regex match filter. Default: // (empty - no matches)
     * @param maxMatchCount The maximum no of matches for the category to be included. Default: -1 (disabled)
     */
    constructor(
        public enabled: boolean = false,
        public match: RegExp = new RegExp(""),
        public maxMatchCount: number = -1 // disabled
    ) {}
}

/**
 * Defines how sorting is to be applied.
 * First handles the static strings, then applies the SortPartConfigurations until there are no items left.
 * Note: If there are additional items left when done above then these will be added at the bottom in the original sorting order.
 */
export class SortConfiguration {
    /**
     * Creates a sort-configuration that defines how to order the items scoped.
     *
     * @param enabled Enables or disables the feature. Default: false
     * @param parts List of sort-parts. Default: Empty
     */
    constructor(
        public enabled: boolean = false,
        public parts: SortPartConfigurationType[] = []
    ) {}
}

type SortPartConfigurationType = string | SortPartConfiguration;

/**
 * Defines how sorting is to be applied for the given part.
 */
export class SortPartConfiguration {
    /**
     * Creates a sort-part that defines how to order the items scoped.
     *
     * @param match Defines the match (string or regex) that defines the scope of items to sort. Default: ".*" (anything)
     * @param method Defines the method/field and order to use when sorting. Default: Original
     */
    constructor(
        public match: RegExp | string = /.*/,
        public method: SortMethod = SortMethod.Original
    ) {}
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
     * Creates a LimitPageConfiguration instance. Default: Show first page, with 5 items.
     *
     * @param enabled Enables or disables the feature. Default: false
     * @param page Defines the page to show. Default: 1
     * @param pageSize Defines the pageSize that with the `page` controls which item-range to show. Default: 5
     */
    constructor(
        public enabled: boolean = false,
        public page: number = 1,
        public pageSize: number = 5
    ) {}
}
