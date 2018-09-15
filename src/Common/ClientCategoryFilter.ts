/**
 * The configuration describes how the specific node is to be filtered, sorted, and/or grouped.
 * Applied in this order:
 * - grouping: Grouping might change all items on this level (introduces an extra layer).
 *             If an extra group-level is introduced then it will be subject for all
 *             consecutive processes in this class.
 * - filter: Reduce to allowed items based on filter.
 * - minCount: Reduce to allowed items based on count.
 * - sort: Changes the order of items left to display.
 * - limit: Limits the no of sorted items to display.
 *
 * @default - All features disabled.
 */
export class ClientCategoryFilter {
    /**
     * Used to create an extra level of categories that group items together.
     *
     * @default null
     */
    public grouping?:
        | DisplayNameGroupingConfiguration
        | CountGroupingConfiguration[]
        | null = null;

    /**
     * Used to include only categories that match the provided filter.
     *
     * @default null
     */
    public filter?: RegExp | null = null;

    /**
     * Used to exclude items with a count less than the provided value.
     *
     * @default null
     */
    public minCount?: number | null = null;

    /**
     * Used to change the order of the categories.
     * First handles the static strings, then applies the SortPartConfigurations until there are no items left.
     * Note: If there are additional items left when done above then these will be added at the bottom in the original sorting order.
     *
     * @default empty
     */
    public sort?: SortConfiguration[] = [];

    /**
     * Used to limit the number of items to display.
     * The regular use-case is to set a number, which acts as the number of items to show.
     * But, the limit is also designed to allow paging, by instead assigning a
     * LimitPageConfiguration, which can set the page and pageSizer to control which
     * range of items to show.
     *
     * @default null
     */
    public limit?: number | LimitPageConfiguration | null = null;
}

/**
 * Defines how sorting is to be applied.
 */
export type SortConfiguration = string | SortPartConfiguration;

/**
 * Defines a part where sorting is to be applied.
 */
export class SortPartConfiguration {
    /**
     * Creates a sort-part that defines how to order the items scoped.
     *
     * @param method Defines the method/field to use when sorting
     * @param match Defines the match (string or regex) that defines the scope of items to sort.
     * @param order Defines whether to sort ascending or descending.
     */
    constructor(
        public method: SortMethod,
        public match: RegExp | string = /.*/,
        public order: SortOrder = SortOrder.Asc
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
     * Sort by DisplayName field.
     */
    DisplayName = "DisplayName",

    /**
     * Sort by Count field.
     */
    Count = "Count"
}

/**
 * Defines which order to use when sorting the items.
 */
export enum SortOrder {
    /**
     * Sorts the items in ascending order (low to high).
     */
    Asc = "Asc",

    /**
     * Sorts the items in descending order (high to low).
     */
    Desc = "Desc"
}

/**
 * Defines paging parameters for controlling which range of items to show.
 * @default - Show first page, with 5 items.
 */
export class LimitPageConfiguration {
    /**
     * Creates a LimitPageConfiguration instance.
     *
     * @param page Defines the page to show.
     * @param pageSize Defines the pageSize that with the `page` controls which item-range to show.
     */
    constructor(public page: number = 1, public pageSize: number = 5) {}
}

/**
 * Defines how items are to be grouped when using regular expression-based grouping.
 *
 * @default Disabled
 */
export class DisplayNameGroupingConfiguration {
    /**
     * Creates a DisplayNameGroupingConfiguration instance.
     *
     * @param match The regex to group on (i.e. First letter from items: /^(.)/
     * @param value The string to use as regex replace on.
     */
    constructor(
        public match: RegExp | null = null,
        public value: string = "$1"
    ) {}
}

/**
 * Defines how items are to be grouped when using count-based grouping.
 */
export class CountGroupingConfiguration {
    /**
     * Creates a new count-group range.
     *
     * @param min Defines the minimum number of counts in order for the item to be grouped.
     * @param max Defines the minimum number of counts in order for the item to be grouped.
     * @param displayName Defines the display of the grouped item.
     */
    constructor(
        public min: number,
        public max: number,
        public displayName?: string
    ) {
        if (typeof this.displayName !== undefined) {
            this.displayName = `Count ${this.min}-${this.max}`;
        }
    }
}
