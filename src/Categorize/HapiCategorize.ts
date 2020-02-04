import { AuthToken } from "../Authentication";
import {
    BaseCall,
    DateSpecification,
    Fetch,
    Filter,
    Query,
    SearchType,
    MatchMode,
    SortPartConfiguration,
    SortMethod,
    LimitPageConfiguration,
    CategoryPresentation,
    CategorizationType
} from "../Common";
import { ICategories, ICategory, IGroup } from "../Data";
import { CategorizeQueryConverter } from "./CategorizeQueryConverter";
import { CategorizeSettings, ICategorizeSettings } from "./CategorizeSettings";
import { HapiClient } from '../Common/Hapi/HapiClient';
import { categorize } from '../Common/Hapi/Typings/categorize';
import { CategorizeResultMapper } from '../Common/Hapi/Mappers/CategorizeResultMapper';

/**
 * The Categorize service queries the search-engine for which categories that any
 * search-matches for the same query will contain.
 *
 * It is normally used indirectly via the SearchClient class.
 */
export class HapiCategorize extends BaseCall<ICategories> {
    /**
     * This represents the last categories that was received from the backend.
     *
     * Note: Normally these are only used internally. You *can* however
     * populate these yourself, but if you are also executing fetches (which
     * the SearchClient is often doing in the automatic mode) then the contents
     * may be overwritten at any time.
     */
    public categories: ICategories;

    public settings: ICategorizeSettings;

    private queryConverter: CategorizeQueryConverter;

    private client: HapiClient;

    /**
     * Creates a Categorize instance that handles fetching categories dependent on settings and query.
     * Supports registering a callback in order to receive categories when they have been received.
     * @param settings - The settings that define how the Categorize instance is to operate.
     * @param auth - An object that handles the authentication.
     */
    constructor(
        settings?: ICategorizeSettings | string,
        auth?: AuthToken,
        fetchMethod?: Fetch
    ) {
        super(); // dummy
        // prepare for super.init
        settings = new CategorizeSettings(settings);
        auth = auth || new AuthToken();
        super.init(settings, auth, fetchMethod);
        // Set own this props
        this.queryConverter = new CategorizeQueryConverter();
        this.client = new HapiClient(settings);
    }

    /**
     * Fetches the search-result categories from the server.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a Categories object.
     */
    public fetch(
        query: Query = new Query(),
        suppressCallbacks: boolean = false
    ): Promise<ICategories> {
        let url = this.queryConverter.getUrl(this.settings.url, query);
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
            this.fetchQuery = new Query(query);

            let categoryFilter = new Array<any>();
            query.filters.forEach(f => {
                categoryFilter.push({
                    values: f.category.categoryName
                });             
            });

            return this.client.categorize(query.queryText, categoryFilter).then((data: categorize) => {
                return CategorizeResultMapper.map(this.settings.hapiIndexId, data);     
                })
                .then((categories: ICategories) => {
                    if (categories.errorMessage) {
                        throw new Error(categories.errorMessage);
                    }
                    this.categories = categories;
                    categories = this.filterCategories(categories, query);
                    this.cbSuccess(suppressCallbacks, categories, url, reqInit);
                    return categories;
                })
                .catch(error => {
                    this.cbError(suppressCallbacks, error, url, reqInit);
                    throw error;
                });
        } else {
            // TODO: When a fetch is stopped due to cbRequest returning false, should we:
            // 1) Reject the promise (will then be returned as an error).
            // or
            // 2) Resolve the promise (will then be returned as a success).
            // or
            // 3) should we do something else (old code returned undefined...)
            return Promise.resolve(null);
        }
    }
    public clientCategoriesUpdate(query: Query): void {
        if (this.shouldUpdate()) {
            this.cbSuccess(
                false,
                this.filterCategories(this.categories, query),
                null,
                null
            );
        }
    }

    public categorizationTypeChanged(
        oldValue: CategorizationType,
        query: Query
    ): void {
        if (!this.shouldUpdate("categorizationType", query)) {
            return;
        }
        if (this.settings.triggers.categorizationTypeChanged) {
            this.update(query);
        }
    }

    public clientIdChanged(oldValue: string, query: Query) {
        if (!this.shouldUpdate("clientId", query)) {
            return;
        }
        if (this.settings.triggers.clientIdChanged) {
            this.update(query);
        }
    }

    public dateFromChanged(oldValue: DateSpecification, query: Query) {
        if (!this.shouldUpdate("dateFrom", query)) {
            return;
        }
        if (this.settings.triggers.dateFromChanged) {
            this.update(query);
        }
    }

    public dateToChanged(oldValue: DateSpecification, query: Query) {
        if (!this.shouldUpdate("dateTo", query)) {
            return;
        }
        if (this.settings.triggers.dateToChanged) {
            this.update(query);
        }
    }

    public filtersChanged(oldValue: Filter[], query: Query) {
        if (!this.shouldUpdate("filters", query)) {
            return;
        }
        if (this.settings.triggers.filtersChanged) {
            this.update(query);
        }
    }

    public queryTextChanged(oldValue: string, query: Query) {
        if (!this.shouldUpdate("queryText", query)) {
            return;
        }
        if (this.settings.triggers.queryChange) {
            if (
                query.queryText.trim().length >
                this.settings.triggers.queryChangeMinLength
            ) {
                if (
                    this.settings.triggers.queryChangeInstantRegex &&
                    this.settings.triggers.queryChangeInstantRegex.test(
                        query.queryText
                    )
                ) {
                    this.update(query);
                    return;
                } else {
                    if (this.settings.triggers.queryChangeDelay > -1) {
                        this.update(
                            query,
                            this.settings.triggers.queryChangeDelay
                        );
                        return;
                    }
                }
            }
        }
        clearTimeout(this.delay);
    }

    public searchTypeChanged(oldValue: SearchType, query: Query) {
        if (!this.shouldUpdate("searchType", query)) {
            return;
        }
        if (this.settings.triggers.searchTypeChanged) {
            this.update(query);
        }
    }

    public uiLanguageCodeChanged(oldValue: string, query: Query) {
        if (!this.shouldUpdate("uiLanguageCode", query)) {
            return;
        }
        if (this.settings.triggers.uiLanguageCodeChanged) {
            this.update(query);
        }
    }

    /**
     * Creates a Filter object based on the input id (string [] or Category).
     *
     * NB! This method does NOT apply the filter in the filters collection.
     * It is used behind the scenes by the filter* methods in SearchClient.
     * To apply a filter you need to use the filter* properties/methods in
     * SearchClient.
     *
     * If the category doesn't exist then the filter
     * will not be created.
     *
     * If passing in a string[] then the value is expected to match the categoryName
     * property of a listed category.
     *
     * @param categoryName A string array or a Category that denotes the category to create a filter for.
     */
    public createCategoryFilter(categoryName: string[] | ICategory): Filter {
        let catName = Array.isArray(categoryName)
            ? categoryName
            : categoryName.categoryName;
        let result: string[] = [];
        let path = catName.slice(0);
        let groupId = path.splice(0, 1)[0].toLowerCase();

        if (
            !this.categories ||
            !this.categories.groups ||
            this.categories.groups.length === 0
        ) {
            return null;
        }

        let group = this.categories.groups.find(
            g => g.name.toLowerCase() === groupId
        );

        if (!group) {
            return null;
        }

        result.push(group.displayName);

        if (group.categories.length > 0) {
            let {
                displayName,
                ref
            } = this.getCategoryPathDisplayNameFromCategories(
                path,
                group.categories
            );
            if (displayName && displayName.length > 0) {
                result = result.concat(displayName);
                return new Filter(result, ref);
            }
        }

        return null;
    }

    /**
     * Find the category based on the category-name array.
     *
     * @param categoryName The category array that identifies the category.
     * @returns The Category object if found or null.
     */
    public findCategory(
        categoryName: string[],
        categories?: ICategories
    ): IGroup | ICategory | null {
        categories = categories || this.categories;
        if (!categories) {
            return null;
        }
        let groupIndex = categories.groups.findIndex(
            g => g.name === categoryName[0]
        );
        if (groupIndex < 0) {
            return null;
        }
        let group = categories.groups[groupIndex];
        if (categoryName.length === 1) {
            return group;
        }
        let category = this.getCategoryPathDisplayNameFromCategories(
            categoryName.slice(1),
            group.categories
        );

        return category ? category.ref : null;
    }

    /**
     * Adds missing filters as category-tree-nodes.
     */
    private addFiltersIfMissing(filters: Filter[], cats: ICategories) {
        filters.forEach(f => {
            const depth = f.displayName.length;
            for (let i = 0; i < depth; i++) {
                let categoryNames = f.category.categoryName.slice(0, i + 1);
                if (!this.findCategory(categoryNames, cats)) {
                    let displayName = f.displayName[i];
                    let parentCategoryNames = categoryNames.slice(0, -1);
                    if (i === 0) {
                        // Need to add group
                        let group = {
                            displayName,
                            categories: [],
                            expanded: false,
                            name: categoryNames[0]
                        } as IGroup;
                        cats.groups.push(group);
                    } else {
                        // Need to add child category
                        let parent = this.findCategory(
                            parentCategoryNames,
                            cats
                        );
                        if (!parent) {
                            throw Error(
                                "Since we are iterating from groups and outwards this should not happen."
                            );
                        }
                        let category =
                            i === depth - 1
                                ? // Since we are on the last element we can add the category within the filter directly
                                  {
                                      ...f.category,
                                      ...{ count: 0, expanded: false }
                                  }
                                : // Not at the leaf-node yet.
                                  ({
                                      categoryName: categoryNames,
                                      children: [],
                                      count: 0,
                                      expanded: false,
                                      displayName,
                                      name: categoryNames[i]
                                  } as ICategory);

                        // Since the parent has a child, set the node to be expanded.
                        parent.expanded = true;

                        // Add the child-category to the parent-node
                        if (i === 1) {
                            // Parent is a group
                            (parent as IGroup).categories.push(category);
                        } else {
                            // Parent is a category
                            (parent as ICategory).children.push(category);
                        }
                    }
                }
            }
        });
    }

    private filterCategories(
        categories: ICategories,
        query: Query = new Query()
    ): ICategories {
        // ROOT level adjustments
        let cats = { ...categories };
        let rootOverride = this.settings.presentations.__ROOT__;
        if (rootOverride) {
            if (
                rootOverride.group &&
                rootOverride.group.enabled &&
                cats.groups.length >= rootOverride.group.minCount
            ) {
                // Add level of categories to group according to pattern
                cats.groups = this.grouping(rootOverride, cats.groups);
            }
            if (rootOverride.filter && rootOverride.filter.enabled) {
                cats.groups = this.filtering(rootOverride, cats.groups);
            }
            if (rootOverride.sort && rootOverride.sort.enabled) {
                // Reorder level
                cats.groups = this.sorting(rootOverride, cats.groups);
            }
            if (rootOverride.limit && rootOverride.limit.enabled) {
                // Limit which categories to show
                cats.groups = this.limiting(cats.groups, rootOverride.limit);
            }
            // Skipping expansion, as root is always expanded
        }
        // GROUP-level adjustments
        let groups = cats.groups.map((inGroup: IGroup) => {
            let group = { ...inGroup };
            let groupOverride = this.settings.presentations[group.name];
            if (groupOverride) {
                if (
                    groupOverride.group &&
                    groupOverride.group.enabled &&
                    group.categories.length >= groupOverride.group.minCount
                ) {
                    // Add level of categories to group according to pattern
                    group.categories = this.grouping(
                        groupOverride,
                        group.categories
                    );
                }
                if (groupOverride.filter && groupOverride.filter.enabled) {
                    group.categories = this.filtering(
                        groupOverride,
                        group.categories
                    );
                }
                if (groupOverride.sort && groupOverride.sort.enabled) {
                    // Reorder level
                    group.categories = this.sorting(
                        groupOverride,
                        group.categories
                    );
                }
                if (groupOverride.limit && groupOverride.limit.enabled) {
                    // Limit which categories to show
                    group.categories = this.limiting(
                        group.categories,
                        groupOverride.limit
                    );
                }
                if (groupOverride.expanded !== null) {
                    // Override whether the group is to be expanded or not
                    group.expanded = groupOverride.expanded;
                }
            }
            if (group.categories && group.categories.length > 0) {
                group.categories = this.mapCategories(group.categories);
            }
            return group;
        });
        cats.groups = groups.filter(g => g !== undefined);
        this.addFiltersIfMissing(query.filters, cats);
        return cats;
    }

    private mapCategories(categories: ICategory[]): ICategory[] {
        // CATEGORY_level adjustments
        let cats = [...categories];
        cats = cats.map((inCategory: ICategory) => {
            let category = { ...inCategory };
            let categoryOverride = this.settings.presentations[
                category.categoryName.join("|")
            ];
            if (categoryOverride) {
                if (
                    categoryOverride.group &&
                    categoryOverride.group.enabled &&
                    category.children.length >= categoryOverride.group.minCount
                ) {
                    category.children = this.grouping(
                        categoryOverride,
                        category.children
                    );
                }
                if (
                    categoryOverride.filter &&
                    categoryOverride.filter.enabled
                ) {
                    category.children = this.filtering(
                        categoryOverride,
                        category.children
                    );
                }
                if (categoryOverride.sort && categoryOverride.sort.enabled) {
                    category.children = this.sorting(
                        categoryOverride,
                        category.children
                    );
                }
                if (categoryOverride.limit && categoryOverride.limit.enabled) {
                    category.children = this.limiting(
                        category.children,
                        categoryOverride.limit
                    );
                }
                if (categoryOverride.expanded !== null) {
                    category.expanded = categoryOverride.expanded;
                }
            }
            if (category.children && category.children.length > 0) {
                category.children = this.mapCategories(category.children);
            }

            return category;
        });

        cats = cats.filter(c => c !== undefined);
        return cats;
    }
    private grouping<T extends IGroup | ICategory>(
        categoryOverride: CategoryPresentation,
        categories: T[]
    ): T[] {
        let matchCategories: Map<string, ICategory[]> = new Map<
            string,
            ICategory[]
        >();

        let category2MatchCategory: Map<string, string> = new Map<
            string,
            string
        >();

        // Iterate, map and count to check whether or not to group results.
        let isCategory: boolean;
        for (let c of categories) {
            let groupName = categoryOverride.group.getMatch(c.displayName);
            if (!groupName) {
                continue;
            }

            isCategory = c.hasOwnProperty("count");
            let newNode: ICategory = isCategory
                ? (c as ICategory)
                : {
                      categoryName: [c.name],
                      children: (c as IGroup).categories,
                      // We are really not sure what the real count is, as the category-hits may or may not be referring to the same items
                      // -1 should indicate "do not show"
                      count: -1,
                      displayName: c.displayName,
                      expanded: c.expanded,
                      name: c.name
                  };

            if (!matchCategories.has(groupName)) {
                matchCategories.set(groupName, [newNode]);
            } else {
                let collection = matchCategories.get(groupName);
                collection.push(newNode);
                matchCategories.set(groupName, collection);
            }
            category2MatchCategory.set(c.displayName, groupName);
        }

        // Do actual re-mapping, if any
        return categories
            .map(c => {
                let displayName = category2MatchCategory.get(c.displayName);
                if (!displayName) {
                    // Done before
                    return undefined;
                }
                let matchCategory = matchCategories.get(displayName);
                if (!matchCategory) {
                    return c;
                }
                if (
                    matchCategory.length >=
                    categoryOverride.group.minCountPerGroup
                ) {
                    let newCategory = {
                        name: `__${displayName}__`,
                        children: matchCategory,
                        displayName,
                        expanded: true,
                        categoryName: [`__${displayName}__`]
                    } as T;
                    if (isCategory) {
                        (newCategory as ICategory).count = -1;
                    }

                    matchCategory.forEach(i => {
                        category2MatchCategory.delete(i.displayName);
                    });
                    return newCategory;
                } else {
                    return c;
                }
            })
            .filter(c => c !== undefined);
    }

    private filtering<T extends IGroup | ICategory>(
        override: CategoryPresentation,
        groups: T[]
    ): T[] {
        return groups.filter(g => {
            if (override.filter.match) {
                let matchName =
                    override.filter.matchMode === MatchMode.DisplayName
                        ? g.displayName
                        : g.name;
                return override.filter.match.test(matchName);
            }
        });
    }

    private sorting<T extends ICategory | IGroup>(
        categoryOverride: CategoryPresentation,
        categories: T[]
    ): T[] {
        // 1. Create parts2group-map
        let part2cats = new Map<SortPartConfiguration, T[]>();
        for (let p of categoryOverride.sort.parts) {
            part2cats.set(p, []);
        }

        let other = new Array<T>();
        let stringMatches = categoryOverride.sort.parts.filter(
            p => typeof p.match === "string"
        );
        let regexMatches = categoryOverride.sort.parts.filter(
            p => typeof p.match === "object"
        );

        for (let c of categories) {
            let found = false;
            for (let stringPart of stringMatches) {
                if (
                    stringPart.match ===
                    (stringPart.matchMode === MatchMode.DisplayName
                        ? c.displayName
                        : c.name)
                ) {
                    let collection = part2cats.get(stringPart);
                    collection.push(c);
                    part2cats.set(stringPart, collection);
                    found = true;
                    break;
                }
            }
            if (found) {
                continue;
            }
            for (let regexPart of regexMatches) {
                if (
                    (regexPart.match as RegExp).test(
                        regexPart.matchMode === MatchMode.DisplayName
                            ? c.displayName
                            : c.name
                    )
                ) {
                    let collection = part2cats.get(regexPart);
                    collection.push(c);
                    part2cats.set(regexPart, collection);
                    found = true;
                    break;
                }
            }
            if (!found) {
                other.push(c);
            }
        }

        // 2. Sort each part
        let sortedCats = new Array<T>();
        part2cats.forEach((cs, p) => {
            if (cs.length === 1) {
                sortedCats = sortedCats.concat(cs);
                return;
            }
            let res = new Array<T>();

            switch (p.sortMethod) {
                case SortMethod.AlphaAsc:
                    res = cs.sort((a, b) => {
                        let aVal =
                            p.matchMode === MatchMode.DisplayName
                                ? a.displayName
                                : a.name;
                        let bVal =
                            p.matchMode === MatchMode.DisplayName
                                ? b.displayName
                                : b.name;
                        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                    });
                    break;

                case SortMethod.AlphaDesc:
                    res = cs.sort((a, b) => {
                        let aVal =
                            p.matchMode === MatchMode.DisplayName
                                ? a.displayName
                                : a.name;
                        let bVal =
                            p.matchMode === MatchMode.DisplayName
                                ? b.displayName
                                : b.name;
                        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
                    });
                    break;

                case SortMethod.CountAsc:
                    if (cs[0].hasOwnProperty("count")) {
                        res = (cs as ICategory[]).sort((a, b) => {
                            return a.count < b.count
                                ? -1
                                : a.count > b.count
                                    ? 1
                                    : 0;
                        }) as T[];
                    } else {
                        res = cs;
                    }
                    break;
                case SortMethod.CountDesc:
                    if (cs[0].hasOwnProperty("count")) {
                        res = (cs as ICategory[]).sort((a, b) => {
                            return a.count > b.count
                                ? -1
                                : a.count < b.count
                                    ? 1
                                    : 0;
                        }) as T[];
                    } else {
                        res = cs;
                    }
                    break;
                case SortMethod.Original:
                default:
                    // Keep order unchanged
                    res = cs;
            }

            sortedCats = sortedCats.concat(res);
        });

        // Finally add any leftovers at the bottom
        return sortedCats.concat(other);
    }

    private limiting(array: any[], limit: LimitPageConfiguration): any[] {
        let from = (limit.page - 1) * limit.pageSize;
        let to = from + limit.pageSize;
        return array.slice(from, to);
    }

    private getCategoryPathDisplayNameFromCategories(
        categoryName: string[],
        categories: ICategory[]
    ): { displayName: string[]; ref: ICategory } {
        let result: string[] = [];
        let path = categoryName.slice(0);
        let catId = path.splice(0, 1)[0].toLowerCase();

        let category = categories.find(c => c.name.toLowerCase() === catId);

        if (!category) {
            return null;
        }

        result.push(category.displayName);

        let res: { displayName: string[]; ref: ICategory };
        if (path.length > 0 && category.children.length === 0) {
            return null;
        }

        if (category.children.length > 0 && path.length > 0) {
            res = this.getCategoryPathDisplayNameFromCategories(
                path,
                category.children
            );
            if (!res) {
                return;
            }
            if (res.displayName && res.displayName.length > 0) {
                result = result.concat(res.displayName);
            }
        }

        return { displayName: result, ref: res ? res.ref : category };
    }
}
