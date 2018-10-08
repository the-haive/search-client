import { AuthToken } from "../Authentication";
import {
    BaseCall,
    DateSpecification,
    Fetch,
    Filter,
    Query,
    SearchType,
    MatchMode
} from "../Common";
import { Categories, Category, Group } from "../Data";
import { CategorizeQueryConverter } from "./CategorizeQueryConverter";
import { CategorizeSettings, ICategorizeSettings } from "./CategorizeSettings";

/**
 * The Categorize service queries the search-engine for which categories that any
 * search-matches for the same query will contain.
 *
 * It is normally used indirectly via the SearchClient class.
 */
export class Categorize extends BaseCall<Categories> {
    /**
     * This represents the last categories that was received from the backend.
     *
     * Note: Normally these are only used internally. You *can* however
     * populate these yourself, but if you are also executing fetches (which
     * the SearchClient is often doing in the automatic mode) then the contents
     * may be overwritten at any time.
     */
    public categories: Categories;

    protected settings: ICategorizeSettings;

    private queryConverter: CategorizeQueryConverter;

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
    ): Promise<Categories> {
        let url = this.queryConverter.getUrl(this.settings.url, query);
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
            return this.fetchMethod(url, reqInit)
                .then((response: Response) => {
                    if (!response.ok) {
                        throw Error(
                            `${response.status} ${
                                response.statusText
                            } for request url '${url}'`
                        );
                    }
                    return response.json();
                })
                .then((categories: Categories) => {
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

    // public clientCategoryFilterChanged(
    //     oldValue: { [key: string]: string | RegExp },
    //     query: Query
    // ): void {
    //     if (
    //         this.shouldUpdate() &&
    //         this.settings.triggers.clientCategoryFilterChanged
    //     ) {
    //         this.cbSuccess(
    //             false,
    //             this.filterCategories(this.categories, query),
    //             null,
    //             null
    //         );
    //     }
    // }

    public clientIdChanged(oldValue: string, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.clientIdChanged) {
            this.update(query);
        }
    }

    public dateFromChanged(oldValue: DateSpecification, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.dateFromChanged) {
            this.update(query);
        }
    }

    public dateToChanged(oldValue: DateSpecification, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.dateToChanged) {
            this.update(query);
        }
    }

    public filtersChanged(oldValue: Filter[], query: Query): void {
        if (this.shouldUpdate() && this.settings.triggers.filterChanged) {
            this.update(query);
        }
    }

    public queryTextChanged(oldValue: string, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.queryChange) {
            if (
                query.queryText.length >
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
        if (this.shouldUpdate() && this.settings.triggers.searchTypeChanged) {
            this.update(query);
        }
    }

    public uiLanguageCodeChanged(oldValue: string, query: Query) {
        if (
            this.shouldUpdate() &&
            this.settings.triggers.uiLanguageCodeChanged
        ) {
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
    public createCategoryFilter(categoryName: string[] | Category): Filter {
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
        categories?: Categories
    ): Group | Category | null {
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
    private addFiltersIfMissing(filters: Filter[], cats: Categories) {
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
                        } as Group;
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
                                  } as Category);

                        // Since the parent has a child, set the node to be expanded.
                        parent.expanded = true;

                        // Add the child-category to the parent-node
                        if (i === 1) {
                            // Parent is a group
                            (parent as Group).categories.push(category);
                        } else {
                            // Parent is a category
                            (parent as Category).children.push(category);
                        }
                    }
                }
            }
        });
    }

    private filterCategories(
        categories: Categories,
        query: Query = new Query()
    ): Categories {
        // ROOT level adjustments
        let cats = { ...categories };
        let rootOverride = this.settings.presentations.__ROOT__;
        if (rootOverride) {
            if (
                rootOverride.group.enabled &&
                cats.groups.length >= rootOverride.group.minCount
            ) {
                // Add level of categories to group according to pattern
                let matchCategories: Map<string, Category[]> = new Map<
                    string,
                    Category[]
                >();

                let group2MatchGroup: Map<string, string> = new Map<
                    string,
                    string
                >();

                // Iterate, map and count to check whether or not to group results.
                for (let g of cats.groups) {
                    let m = rootOverride.group.match.exec(g.displayName);
                    if (m === null) {
                        continue;
                    }
                    let groupName = m[0];

                    let cat: Category = {
                        categoryName: ["dummy"],
                        children: g.categories,
                        // We are really not sure what the real count is, as the category-hits may or may not be referring to the same items
                        // -1 should indicate "do not show"
                        count: -1,
                        displayName: g.displayName,
                        expanded: g.expanded,
                        name: g.name
                    };
                    if (!matchCategories.has(groupName)) {
                        matchCategories.set(groupName, [cat]);
                    } else {
                        let collection = matchCategories.get(groupName);
                        collection.push(cat);
                        matchCategories.set(groupName, collection);
                    }
                    group2MatchGroup.set(g.displayName, groupName);
                }

                // Do actual re-mapping, if any
                cats.groups = cats.groups
                    .map(g => {
                        let displayName = group2MatchGroup.get(g.displayName);
                        if (!displayName) {
                            // Done before
                            return undefined;
                        }
                        let matchGroup = matchCategories.get(displayName);
                        if (!matchGroup) {
                            return g;
                        }
                        if (
                            matchGroup.length >=
                            rootOverride.group.minCountPerGroup
                        ) {
                            let newGroup = {
                                name: `__${displayName}__`,
                                categories: matchGroup,
                                displayName,
                                expanded: true,
                                categoryName: [`__${displayName}__`]
                            } as Group;
                            console.log("Add group", displayName, newGroup);
                            matchGroup.forEach(i => {
                                group2MatchGroup.delete(i.displayName);
                            });
                            return newGroup;
                        } else {
                            console.log("Use group as is", g.displayName);
                            return g;
                        }
                    })
                    .filter(g => g !== undefined);
            }
            if (rootOverride.filter.enabled) {
                cats.groups = cats.groups.filter(g => {
                    if (rootOverride.filter.match) {
                        let matchName =
                            rootOverride.filter.matchMode ===
                            MatchMode.DisplayName
                                ? g.displayName
                                : g.name;
                        return rootOverride.filter.match.test(matchName);
                    }
                });
            }
            if (rootOverride.sort.enabled) {
                // TODO: Reorder level
            }
            if (rootOverride.limit.enabled) {
                // TODO: Limit which categories to show
            }
            // Skipping expansion, as root is always expanded
        }
        // GROUP-level adjustments
        let groups = cats.groups.map((inGroup: Group) => {
            let group = { ...inGroup };
            let groupOverride = this.settings.presentations[group.name];
            if (groupOverride) {
                if (groupOverride.group.enabled) {
                    // TODO: Add level of categories to group according to pattern
                }
                if (groupOverride.filter.enabled) {
                    group.categories = group.categories.filter(c => {
                        if (groupOverride.filter.match) {
                            let matchName =
                                groupOverride.filter.matchMode ===
                                MatchMode.DisplayName
                                    ? c.displayName
                                    : c.name;
                            return groupOverride.filter.match.test(matchName);
                        }
                    });
                }
                if (groupOverride.sort.enabled) {
                    // TODO: Reorder level
                }
                if (groupOverride.limit.enabled) {
                    // TODO: Limit which categories to show
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

    private mapCategories(categories: Category[]): Category[] {
        // CATEGORY_level adjustments
        let cats = [...categories];
        cats = cats.map((inCategory: Category) => {
            let category = { ...inCategory };
            let categoryOverride = this.settings.presentations[
                category.categoryName.join("|")
            ];
            if (categoryOverride) {
                if (categoryOverride.group.enabled) {
                    // TODO: Add level of categories to group according to pattern
                }
                if (categoryOverride.filter.enabled) {
                    category.children = category.children.filter(c => {
                        if (categoryOverride.filter.match) {
                            let matchName =
                                categoryOverride.filter.matchMode ===
                                MatchMode.DisplayName
                                    ? c.displayName
                                    : c.name;
                            return categoryOverride.filter.match.test(
                                matchName
                            );
                        }
                    });
                }
                if (categoryOverride.sort.enabled) {
                    // TODO: Reorder level
                }
                if (categoryOverride.limit.enabled) {
                    // TODO: Limit which categories to show
                }
                if (categoryOverride.expanded !== null) {
                    // Override whether the category is to be expanded or not
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

    private getCategoryPathDisplayNameFromCategories(
        categoryName: string[],
        categories: Category[]
    ): { displayName: string[]; ref: Category } {
        let result: string[] = [];
        let path = categoryName.slice(0);
        let catId = path.splice(0, 1)[0].toLowerCase();

        let category = categories.find(c => c.name.toLowerCase() === catId);

        if (!category) {
            return null;
        }

        result.push(category.displayName);

        let res: { displayName: string[]; ref: Category };
        if (path.length > 0 && category.children.length === 0) {
            return null;
        }

        if (category.children.length > 0 && path.length > 0) {
            res = this.getCategoryPathDisplayNameFromCategories(
                path,
                category.children
            );
            if (res.displayName && res.displayName.length > 0) {
                result = result.concat(res.displayName);
            }
        }

        return { displayName: result, ref: res ? res.ref : category };
    }
}
