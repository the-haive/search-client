import { AuthToken } from '../Authentication'
import {
    BaseCall,
    CategorizationType,
    CategoryPresentation,
    DateSpecification,
    Fetch,
    Filter,
    IQuery,
    LimitPageConfiguration,
    MatchMode,
    Query,
    SearchType,
    SortMethod,
    SortPartConfiguration,
} from '../Common'
import { ICategories, ICategory, IGroup } from '../Data'
import { CategorizeQueryConverter } from './CategorizeQueryConverter'
import { CategorizeSettings, ICategorizeSettings } from './CategorizeSettings'

/**
 * The Categorize service queries the search-engine for which categories that any
 * search-matches for the same query will contain.
 *
 * It is normally used indirectly via the SearchClient class.
 */
export class Categorize extends BaseCall<ICategories> {
    /**
     * This represents the last categories that was received from the backend.
     *
     * Note: Normally these are only used internally. You *can* however
     * populate these yourself, but if you are also executing fetches (which
     * the SearchClient is often doing in the automatic mode) then the contents
     * may be overwritten at any time.
     */
    public categories: ICategories

    public settings: ICategorizeSettings

    private queryConverter: CategorizeQueryConverter

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
        super() // dummy
        // prepare for super.init
        settings = new CategorizeSettings(settings)
        auth = auth || new AuthToken()
        super.init(settings, auth, fetchMethod)
        // Set own this props
        this.queryConverter = new CategorizeQueryConverter()
    }

    public clientCategoriesUpdate(query: IQuery): void {
        if (this.shouldUpdate()) {
            this.cbSuccess(
                false,
                this.filterCategories(this.categories, query),
                null,
                null
            )
        }
    }

    public categorizationTypeChanged(
        oldValue: CategorizationType,
        query: IQuery
    ): void {
        if (!this.shouldUpdate('categorizationType', query)) {
            return
        }
        if (this.settings.triggers.categorizationTypeChanged) {
            this.update(query)
        }
    }

    public clientIdChanged(oldValue: string, query: IQuery) {
        if (!this.shouldUpdate('clientId', query)) {
            return
        }
        if (this.settings.triggers.clientIdChanged) {
            this.update(query)
        }
    }

    public dateFromChanged(oldValue: DateSpecification, query: IQuery) {
        if (!this.shouldUpdate('dateFrom', query)) {
            return
        }
        if (this.settings.triggers.dateFromChanged) {
            this.update(query)
        }
    }

    public dateToChanged(oldValue: DateSpecification, query: IQuery) {
        if (!this.shouldUpdate('dateTo', query)) {
            return
        }
        if (this.settings.triggers.dateToChanged) {
            this.update(query)
        }
    }

    public filtersChanged(oldValue: Filter[], query: IQuery) {
        if (!this.shouldUpdate('filters', query)) {
            return
        }
        if (this.settings.triggers.filtersChanged) {
            this.update(query)
        }
    }

    public queryTextChanged(oldValue: string, query: IQuery) {
        if (!this.shouldUpdate('queryText', query)) {
            return
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
                    this.update(query)
                    return
                } else {
                    if (this.settings.triggers.queryChangeDelay > -1) {
                        this.update(
                            query,
                            this.settings.triggers.queryChangeDelay
                        )
                        return
                    }
                }
            }
        }
        clearTimeout(this.delay)
    }

    public searchTypeChanged(oldValue: SearchType, query: IQuery) {
        if (!this.shouldUpdate('searchType', query)) {
            return
        }
        if (this.settings.triggers.searchTypeChanged) {
            this.update(query)
        }
    }

    public uiLanguageCodeChanged(oldValue: string, query: IQuery) {
        if (!this.shouldUpdate('uiLanguageCode', query)) {
            return
        }
        if (this.settings.triggers.uiLanguageCodeChanged) {
            this.update(query)
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
        const catName = Array.isArray(categoryName)
            ? categoryName
            : categoryName.categoryName
        let result: string[] = []
        const path = catName.slice(0)
        const groupId = path.splice(0, 1)[0].toLowerCase()

        if (
            !this.categories ||
            !this.categories.groups ||
            this.categories.groups.length === 0
        ) {
            return null
        }

        const group = this.categories.groups.find(
            g => g.name.toLowerCase() === groupId
        )

        if (!group) {
            return null
        }

        result.push(group.displayName)

        if (group.categories.length > 0) {
            const {
                displayName,
                ref,
            } = this.getCategoryPathDisplayNameFromCategories(
                path,
                group.categories
            )
            if (displayName && displayName.length > 0) {
                result = result.concat(displayName)
                return new Filter(result, ref)
            }
        }

        return null
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
        categories = categories || this.categories
        if (!categories) {
            return null
        }
        const groupIndex = categories.groups.findIndex(
            g => g.name === categoryName[0]
        )
        if (groupIndex < 0) {
            return null
        }
        const group = categories.groups[groupIndex]
        if (categoryName.length === 1) {
            return group
        }
        const category = this.getCategoryPathDisplayNameFromCategories(
            categoryName.slice(1),
            group.categories
        )

        return category ? category.ref : null
    }

    /**
     * Fetches the search-result categories from the server.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a Categories object.
     */
    protected async fetchInternal(
        query: IQuery = new Query(),
        suppressCallbacks: boolean = false
    ): Promise<ICategories> {
        const reqInit = this.requestObject()
        this.fetchQuery = new Query(query)
        const url = this.queryConverter.getUrl(
            this.settings.url,
            this.fetchQuery
        )

        try {
            if (!this.cbRequest(suppressCallbacks, url, reqInit)) {
                const err = new Error()
                err.name = 'cbRequestCancelled'
                throw err
            }
            const response = await this.fetchMethod(url, reqInit)
            if (!response.ok) {
                throw Error(
                    `${response.status} ${response.statusText} for request url '${url}'`
                )
            }
            let categories: ICategories = await response.json()

            this.categories = categories
            categories = this.filterCategories(categories, query)
            // Handle situations where parsing was ok, but we have an error in the returned message from the server
            if (
                !categories ||
                categories.errorMessage ||
                categories.statusCode !== 0
            ) {
                const warning = {
                    message: categories?.errorMessage || 'Unspecified issue',
                    statusCode: categories?.statusCode,
                }
                console.warn(
                    'search-client/Categorize.fetchInternal()> ',
                    warning
                )
                this.cbWarning(suppressCallbacks, warning, url, reqInit)
            }

            this.cbSuccess(suppressCallbacks, categories, url, reqInit)
            return categories
        } catch (error) {
            if (error.name !== 'AbortError') {
                this.cbError(suppressCallbacks, error, url, reqInit)
            }
            throw error
        }
    }

    /**
     * Adds missing filters as category-tree-nodes.
     */
    private addFiltersInTreeIfMissing(filters: Filter[], cats: ICategories) {
        filters.forEach(f => {
            if (f.hidden) {
                return
            }
            const depth = f.category.categoryName.length
            for (let i = 0; i < depth; i++) {
                const categoryNames = f.category.categoryName.slice(0, i + 1)
                if (!this.findCategory(categoryNames, cats)) {
                    const displayName = f.displayName
                        ? f.displayName[i]
                        : categoryNames[categoryNames.length - 1]
                    const parentCategoryNames = categoryNames.slice(0, -1)
                    if (i === 0) {
                        // Need to add group
                        const group = {
                            displayName,
                            categories: [],
                            expanded: false,
                            name: categoryNames[0],
                        } as IGroup
                        cats.groups.push(group)
                    } else {
                        // Need to add child category
                        const parent = this.findCategory(
                            parentCategoryNames,
                            cats
                        )
                        if (!parent) {
                            throw Error(
                                'Since we are iterating from groups and outwards this should not happen.'
                            )
                        }
                        const category =
                            i === depth - 1
                                ? // Since we are on the last element we can add the category within the filter directly
                                  {
                                      ...{ children: [], displayName },
                                      ...f.category,
                                      ...{ count: 0, expanded: false },
                                  }
                                : // Not at the leaf-node yet.
                                  ({
                                      categoryName: categoryNames,
                                      children: [],
                                      count: 0,
                                      expanded: false,
                                      displayName,
                                      name: categoryNames[i],
                                  } as ICategory)

                        // Since the parent has a child, set the node to be expanded.
                        parent.expanded = true

                        // Add the child-category to the parent-node
                        if (i === 1) {
                            // Parent is a group
                            ;(parent as IGroup).categories.push(category)
                        } else {
                            // Parent is a category
                            ;(parent as ICategory).children.push(category)
                        }
                    }
                }
            }
        })
    }

    private filterCategories(
        categories: ICategories,
        query: IQuery = new Query()
    ): ICategories {
        // ROOT level adjustments
        const cats = { ...categories }
        const rootOverride = this.settings.presentations.__ROOT__
        if (rootOverride) {
            if (
                rootOverride.group &&
                rootOverride.group.enabled &&
                cats.groups.length >= rootOverride.group.minCount
            ) {
                // Add level of categories to group according to pattern
                cats.groups = this.grouping(rootOverride, cats.groups)
            }
            if (rootOverride.filter && rootOverride.filter.enabled) {
                cats.groups = this.filtering(rootOverride, cats.groups)
            }
            if (rootOverride.sort && rootOverride.sort.enabled) {
                // Reorder level
                cats.groups = this.sorting(rootOverride, cats.groups)
            }
            if (rootOverride.limit && rootOverride.limit.enabled) {
                // Limit which categories to show
                cats.groups = this.limiting(cats.groups, rootOverride.limit)
            }
            // Skipping expansion, as root is always expanded
        }
        const hiddenFilters: Filter[] = query.filters
            ? query.filters.filter(f => f.hidden)
            : []

        // GROUP-level adjustments
        const groups = cats.groups.map((inGroup: IGroup) => {
            const group = { ...inGroup }

            // Iterate filters that have only the group-level set
            const hiddenFiltersInGroup = hiddenFilters.filter(
                f =>
                    f.category.categoryName.length > 0 &&
                    f.category.categoryName[0] === group.name
            )
            const match = hiddenFiltersInGroup.find(
                f => f.category.categoryName.length === 1
            )
            if (match) {
                // The hidden filter is for this group exactly. So, remove the group
                return null
            }

            const groupOverride = this.settings.presentations[group.name]
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
                    )
                }
                if (groupOverride.filter && groupOverride.filter.enabled) {
                    group.categories = this.filtering(
                        groupOverride,
                        group.categories
                    )
                }
                if (groupOverride.sort && groupOverride.sort.enabled) {
                    // Reorder level
                    group.categories = this.sorting(
                        groupOverride,
                        group.categories
                    )
                }
                if (groupOverride.limit && groupOverride.limit.enabled) {
                    // Limit which categories to show
                    group.categories = this.limiting(
                        group.categories,
                        groupOverride.limit
                    )
                }
                if (groupOverride.expanded !== null) {
                    // Override whether the group is to be expanded or not
                    group.expanded = groupOverride.expanded
                }
            }
            if (group.categories && group.categories.length > 0) {
                group.categories = this.mapCategories(
                    group.categories,
                    hiddenFiltersInGroup,
                    1
                ) // .filter(c => c !== undefined && c !== null);
            }
            if (
                (!group.categories || group.categories.length === 0) &&
                hiddenFiltersInGroup.length > 0
            ) {
                // If the group has no categories, due to hidden filters, then remove the group itself
                return null
            }
            return group
        })
        cats.groups = groups.filter(g => g !== undefined && g !== null)
        this.addFiltersInTreeIfMissing(query.filters, cats)
        return cats
    }

    private mapCategories(
        categories: ICategory[],
        hiddenFilters: Filter[],
        depth: number
    ): ICategory[] {
        // CATEGORY_level adjustments
        let cats = [...categories]
        cats = cats.map((inCategory: ICategory) => {
            const category = { ...inCategory }

            // Iterate filters that have only the group-level set
            const hiddenFiltersInCategory = hiddenFilters.filter(
                f =>
                    f.category.categoryName.length > depth &&
                    f.category.categoryName[depth] === category.name
            )
            if (
                hiddenFiltersInCategory.find(
                    f => f.category.categoryName.length === depth + 1
                )
            ) {
                // The hidden filter is for this category exactly. So, remove the category
                return null
            }

            if (category.categoryName == null) {
                console.warn(
                    `HAIVE/search-client: Illegal category-object received. The categoryName array cannot be null. The category was not added to the category-tree.`,
                    category
                )
                return null
            }

            const categoryOverride = this.settings.presentations[
                category.categoryName.join('|')
            ]
            if (categoryOverride) {
                if (
                    categoryOverride.group &&
                    categoryOverride.group.enabled &&
                    category.children.length >= categoryOverride.group.minCount
                ) {
                    category.children = this.grouping(
                        categoryOverride,
                        category.children
                    )
                }
                if (
                    categoryOverride.filter &&
                    categoryOverride.filter.enabled
                ) {
                    category.children = this.filtering(
                        categoryOverride,
                        category.children
                    )
                }
                if (categoryOverride.sort && categoryOverride.sort.enabled) {
                    category.children = this.sorting(
                        categoryOverride,
                        category.children
                    )
                }
                if (categoryOverride.limit && categoryOverride.limit.enabled) {
                    category.children = this.limiting(
                        category.children,
                        categoryOverride.limit
                    )
                }
                if (categoryOverride.expanded !== null) {
                    category.expanded = categoryOverride.expanded
                }
            }
            if (category.children && category.children.length > 0) {
                category.children = this.mapCategories(
                    category.children,
                    hiddenFilters,
                    depth++
                )
            }
            if (
                (!category.children || category.children.length === 0) &&
                hiddenFiltersInCategory.length > 0
            ) {
                // If the category has no children, due to hidden filters, then remove the category itself
                return null
            }

            return category
        })

        cats = cats.filter(c => c !== undefined && c !== null)
        return cats
    }
    private grouping<T extends IGroup | ICategory>(
        categoryOverride: CategoryPresentation,
        categories: T[]
    ): T[] {
        const matchCategories: Map<string, ICategory[]> = new Map<
            string,
            ICategory[]
        >()

        const category2MatchCategory: Map<string, string> = new Map<
            string,
            string
        >()

        // Iterate, map and count to check whether or not to group results.
        let isCategory: boolean
        for (const c of categories) {
            const groupName = categoryOverride.group.getMatch(c.displayName)
            if (!groupName) {
                continue
            }

            isCategory = c.hasOwnProperty('count')
            const newNode: ICategory = isCategory
                ? (c as ICategory)
                : {
                      categoryName: [c.name],
                      children: (c as IGroup).categories,
                      // We are really not sure what the real count is, as the category-hits may or may not be referring to the same items
                      // -1 should indicate "do not show"
                      count: -1,
                      displayName: c.displayName,
                      expanded: c.expanded,
                      name: c.name,
                  }

            if (!matchCategories.has(groupName)) {
                matchCategories.set(groupName, [newNode])
            } else {
                const collection = matchCategories.get(groupName)
                collection.push(newNode)
                matchCategories.set(groupName, collection)
            }
            category2MatchCategory.set(c.displayName, groupName)
        }

        // Do actual re-mapping, if any
        return categories
            .map(c => {
                const displayName = category2MatchCategory.get(c.displayName)
                if (!displayName) {
                    // Done before
                    return undefined
                }
                const matchCategory = matchCategories.get(displayName)
                if (!matchCategory) {
                    return c
                }
                if (
                    matchCategory.length >=
                    categoryOverride.group.minCountPerGroup
                ) {
                    const newCategory = {
                        name: `__${displayName}__`,
                        children: matchCategory,
                        displayName,
                        expanded: true,
                        categoryName: [`__${displayName}__`],
                    } as T
                    if (isCategory) {
                        ;(newCategory as ICategory).count = -1
                    }

                    matchCategory.forEach(i => {
                        category2MatchCategory.delete(i.displayName)
                    })
                    return newCategory
                } else {
                    return c
                }
            })
            .filter(c => c !== undefined && c !== null)
    }

    private filtering<T extends IGroup | ICategory>(
        override: CategoryPresentation,
        groups: T[]
    ): T[] {
        return groups.filter(g => {
            if (override.filter.match) {
                const matchName =
                    override.filter.matchMode === MatchMode.DisplayName
                        ? g.displayName
                        : g.name
                return override.filter.match.test(matchName)
            }
        })
    }

    private sorting<T extends ICategory | IGroup>(
        categoryOverride: CategoryPresentation,
        categories: T[]
    ): T[] {
        // 1. Create parts2group-map
        const part2cats = new Map<SortPartConfiguration, T[]>()
        for (const p of categoryOverride.sort.parts) {
            part2cats.set(p, [])
        }

        const other = new Array<T>()
        const stringMatches = categoryOverride.sort.parts.filter(
            p => typeof p.match === 'string'
        )
        const regexMatches = categoryOverride.sort.parts.filter(
            p => typeof p.match === 'object'
        )

        for (const c of categories) {
            let found = false
            for (const stringPart of stringMatches) {
                if (
                    stringPart.match ===
                    (stringPart.matchMode === MatchMode.DisplayName
                        ? c.displayName
                        : c.name)
                ) {
                    const collection = part2cats.get(stringPart)
                    collection.push(c)
                    part2cats.set(stringPart, collection)
                    found = true
                    break
                }
            }
            if (found) {
                continue
            }
            for (const regexPart of regexMatches) {
                if (
                    (regexPart.match as RegExp).test(
                        regexPart.matchMode === MatchMode.DisplayName
                            ? c.displayName
                            : c.name
                    )
                ) {
                    const collection = part2cats.get(regexPart)
                    collection.push(c)
                    part2cats.set(regexPart, collection)
                    found = true
                    break
                }
            }
            if (!found) {
                other.push(c)
            }
        }

        // 2. Sort each part
        let sortedCats = new Array<T>()
        part2cats.forEach((cs, p) => {
            if (cs.length === 1) {
                sortedCats = sortedCats.concat(cs)
                return
            }
            let res = new Array<T>()

            switch (p.sortMethod) {
                case SortMethod.AlphaAsc:
                    res = cs.sort((a, b) => {
                        const aVal =
                            p.matchMode === MatchMode.DisplayName
                                ? a.displayName
                                : a.name
                        const bVal =
                            p.matchMode === MatchMode.DisplayName
                                ? b.displayName
                                : b.name
                        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
                    })
                    break

                case SortMethod.AlphaDesc:
                    res = cs.sort((a, b) => {
                        const aVal =
                            p.matchMode === MatchMode.DisplayName
                                ? a.displayName
                                : a.name
                        const bVal =
                            p.matchMode === MatchMode.DisplayName
                                ? b.displayName
                                : b.name
                        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
                    })
                    break

                case SortMethod.CountAsc:
                    if (cs[0].hasOwnProperty('count')) {
                        res = (cs as ICategory[]).sort((a, b) => {
                            return a.count < b.count
                                ? -1
                                : a.count > b.count
                                ? 1
                                : 0
                        }) as T[]
                    } else {
                        res = cs
                    }
                    break
                case SortMethod.CountDesc:
                    if (cs[0].hasOwnProperty('count')) {
                        res = (cs as ICategory[]).sort((a, b) => {
                            return a.count > b.count
                                ? -1
                                : a.count < b.count
                                ? 1
                                : 0
                        }) as T[]
                    } else {
                        res = cs
                    }
                    break
                case SortMethod.Original:
                default:
                    // Keep order unchanged
                    res = cs
            }

            sortedCats = sortedCats.concat(res)
        })

        // Finally add any leftovers at the bottom
        return sortedCats.concat(other)
    }

    private limiting(array: any[], limit: LimitPageConfiguration): any[] {
        const from = (limit.page - 1) * limit.pageSize
        const to = from + limit.pageSize
        return array.slice(from, to)
    }

    private getCategoryPathDisplayNameFromCategories(
        categoryName: string[],
        categories: ICategory[]
    ): { displayName: string[]; ref: ICategory } {
        let result: string[] = []
        const path = categoryName.slice(0)
        const catId = path.splice(0, 1)[0].toLowerCase()

        const category = categories.find(c => c.name.toLowerCase() === catId)

        if (!category) {
            return null
        }

        result.push(category.displayName)

        let res: { displayName: string[]; ref: ICategory }
        if (path.length > 0 && category.children.length === 0) {
            return null
        }

        if (category.children.length > 0 && path.length > 0) {
            res = this.getCategoryPathDisplayNameFromCategories(
                path,
                category.children
            )
            if (!res) {
                return
            }
            if (res.displayName && res.displayName.length > 0) {
                result = result.concat(res.displayName)
            }
        }

        return { displayName: result, ref: res ? res.ref : category }
    }
}
