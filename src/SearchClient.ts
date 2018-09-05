import deepEqual from "deep-equal";

export * from "./Authentication";
export * from "./Autocomplete";
export * from "./Categorize";
export * from "./Common";
export * from "./Data";
export * from "./Find";
export * from "./Settings";

import { AuthToken, Authentication } from "./Authentication";
import { Autocomplete } from "./Autocomplete";
import { Categorize } from "./Categorize";
import {
    DateSpecification,
    Fetch,
    Filter,
    OrderBy,
    Query,
    SearchType
} from "./Common";
import { Category, Group } from "./Data";
import { Find } from "./Find";
import { Settings } from "./Settings";

/**
 * This is the "main class" of this package. Please read the <a href="https://intellisearch.github.io/search-client/">getting-started section</a>"
 * for a proper introduction.
 *
 * The SearchClient manages a range of other services:
 *   * Authentication,
 *   * Autocomplete,
 *   * Categorize
 *   * Find
 *
 * Each of the above services can be used independently, but it is highly recommended to use the SearchClient instead.
 *
 * The SearchClient allows you to have an advanced search with minimal effort in regards to setup and logics. instead
 * of having to write all the logics yourself the SearchClient exposes the following methods for managing your search:
 *   1. Configure callbacks in your settings-object that you pass to the SearchClient.
 *   2. Configure triggers to define when to do server-lookups and not (if you need to deviate from the defaults)
 *   3. Set query-values real-time (queryText, filters, date-ranges, etc.)
 *   4. Receive autocomplete-suggestions, matches and categories in your callback handlers when the data is available.
 *
 * What happens is that any query-changes that arrive are checked in regards to trigger-settings. If they are to trigger
 * and a callback has been set up then the server is requested and when the data is received it is sent to the callback
 * registered in the settings-object.
 */
export class SearchClient implements AuthToken {
    /**
     * Holds a reference to the setup Authentication service.
     */
    public authentication: Authentication = undefined;

    /**
     * Holds a reference to the currently set authentication token.
     */
    public authenticationToken: string = undefined;

    /**
     * Holds a reference to the setup Autocomplete service.
     */
    public autocomplete: Autocomplete = undefined;

    /**
     * Holds a reference to the setup Categorize service.
     */
    public categorize: Categorize = undefined;

    /**
     * Holds a reference to the setup Find service.
     */
    public find: Find = undefined;

    // tslint:disable-next-line:variable-name
    private _clientCategoryExpansion: { [key: string]: boolean } = {};

    private _clientCategoryFilters: { [key: string]: string | RegExp } = {};

    // tslint:disable-next-line:variable-name
    private _query: Query;

    /**
     *
     * @param baseUrl The baseUrl for the IntelliSearch SearchService rest-service, typically http://server:9950/
     * @param settings A settings object that indicates how the search-client instance is to behave.
     */
    constructor(
        baseUrl: string,
        private settings: Settings = new Settings(),
        fetchMethod?: Fetch
    ) {
        settings = new Settings(settings);

        this.authentication = new Authentication(
            baseUrl,
            this.settings.authentication,
            this,
            fetchMethod
        );
        this.autocomplete = new Autocomplete(
            baseUrl,
            this.settings.autocomplete,
            this,
            fetchMethod
        );
        this.categorize = new Categorize(
            baseUrl,
            this.settings.categorize,
            this,
            fetchMethod
        );
        this.find = new Find(baseUrl, this.settings.find, this, fetchMethod);

        this._query = this.settings.query;
    }

    /**
     * This method is typically called when the user clicks the search-button in the UI.
     *
     * For query-fields that accepts enter the default queryChangeInstantRegex catches enter.
     * When they don't take enter you will have to set up something that either catches the default enter or a user clicks
     * on a "Search"-button or similar. You can choose to use the already current query, or you can pass it in. If you
     * include the query then the internal updates are suppressed while changing the query-properties, to make sure that
     * only one update per service is made (if any of their trigger-checks returned true).
     *
     * @param query If passed in then the query object will update the internal query-object and any updates will trigger
     * (but only once). The consecutive overriding service params are ignored when this parameter has a value. If the
     * query is empty/null/undefined then the services will force an update, but allows the bool params to override this.
     * @param autocomplete Allows turning off updates for the Autocomplete service (if the service is enabled in the
     * settings). Only effective when query is not set.
     * @param categorize Allows turning off updates for the Categorize service (if the service is enabled in the settings).
     * Only effective when query is not set.
     * @param find Allows turning off updates for the Find service (if the service is enabled in the settings). Only
     * effective when query is not set.
     */
    public update(
        query?: Query,
        autocomplete: boolean = true,
        categorize: boolean = true,
        find: boolean = true
    ): void {
        if (query != null) {
            // Update query without triggering any updates.
            this.deferUpdates(true);
            this.query = query;
            // Turning of deferredUpdates will now execute pending updates (if any).
            this.deferUpdates(false);

            // A query was included, so the above update is all we want to do.
            return;
        }

        // Since a query was not passed, then we update based on each service's setting, using the bool params autocomplete,
        // categorize and find to allow overriding and turning off the individual services.
        if (autocomplete && this.autocomplete.shouldUpdate()) {
            this.autocomplete.update(this.query);
        }
        if (categorize && this.categorize.shouldUpdate()) {
            this.categorize.update(this.query);
        }
        if (find && this.find.shouldUpdate()) {
            this.find.update(this.query);
        }
    }

    /**
     * This method is called when you want to force an update call to be made for the services.
     *
     * It may force an update based on the existing this.query value or you can provide a new query object to be used.
     * After having set the value the services will be called, unless they are disabled in their respective configs
     * or turned off in the params to this medhod.
     *
     * @param query If passed in then the query object will update the internal query-object without triggering any updates,
     * but will just after this force an update on all enabled services, that are not turned off by the consecutive params.
     * @param autocomplete Allows turning off updates for the Autocomplete service (if the service is enabled in the
     * settings).
     * @param categorize Allows turning off updates for the Categorize service (if the service is enabled in the settings).
     * @param find Allows turning off updates for the Find service (if the service is enabled in the settings).
     */
    public forceUpdate(
        query?: Query,
        autocomplete: boolean = true,
        categorize: boolean = true,
        find: boolean = true
    ): void {
        if (query != null) {
            // Update query without triggering any updates.
            this.deferUpdates(true);
            this.query = query;
            // Skip executing any potential pending updates.
            this.deferUpdates(false, true);
        }

        // Force an update (by passing null to query param) and forwarding service overrides.
        this.update(null, autocomplete, categorize, find);
    }

    /**
     * Gets the currently registered regex-filters.
     */
    get clientCategoryFilters(): { [key: string]: string | RegExp } {
        return this._clientCategoryFilters;
    }

    /**
     * This is a handy helper to help the user navigating the category-tree. It is typically used when a given node
     * has a lot of categories. This often happens with i.e. the Author category node. With this feature you can
     * present the user with a filter-edit-box in the Author node, and allow them to start typing values which will
     * then filter the category-nodes' displayName to only match the text entered.
     *
     * Nodes that doesn't have any filters are returned, even if filters for other nodes are defined.
     *
     * Also note that the filter automatically sets the expanded property for affected nodes, to help allow them to
     * automatically be shown, with their immediate children.
     *
     * The actual value is an associative array that indicates which category-nodes to filter and what pattern to filter
     * that node with.
     *
     * It will not execute any server-side calls, but may run triggers leading to new content returned in callbacks.
     *
     * **Note 1:** This is only used when:
     *
     * **1. The categorize service is enabled in the [[SearchClient]] constructor (may be disabled via the [[Settings]]
     * object).**
     * **2. You have enabled a [[CategorizeSettings.cbSuccess]] callback.**
     * **3. You have not disabled the [[CategorizeTriggers.clientCategoryFilterChanged]] trigger.**
     *
     * **Note 2:** [[deferUpdates]] will not have any effect on this functionality. Deferring only affects calls to the
     * server and does not stop categorize-callbacks from being run - as long as they are the result of changing the
     * [[clientCategoryFilter]].
     *
     * @example How to set the clientCategoryFilter:
     *
     *     const searchClient = new SearchClient("http://server:9950/");
     *
     *     searchClient.clientCategoryFilters = {
     *         // Show only Author-nodes with DisplayName that matches /john/.
     *         Author: /john/,
     *         // Show only nodes in the System/File/Server node that matches /project/
     *         System_File_Server: /project/,
     *     }
     *
     * As you can see from the example the key is composed by joining the categoryName with an underscore. If you
     * experience problems with this (i.e. your categories have `_` in their names already) then change the
     * [[CategorizeSettings.clientCategoryFiltersSepChar]], for example to `|`. Note that if you do, then you probably
     * also need to quote the keys that have the pipe-character.
     *
     * @example The above example will with [[CategorizeSettings.clientCategoryFiltersSepChar]] set to `|` become:
     *
     *     const searchClient = new SearchClient("http://server:9950/");
     *
     *     searchClient.clientCategoryFilters = {
     *         // Show only Author-nodes with DisplayName that matches /john/.
     *         Author: /john/,
     *         // Show only nodes in the System/File/Server node that matches /project/
     *         "System|File|Server": /project/,
     *     }
     *
     */
    set clientCategoryFilters(clientCategoryFilters: {
        [key: string]: string | RegExp;
    }) {
        if (clientCategoryFilters !== this._clientCategoryFilters) {
            const oldValue = this._clientCategoryFilters;
            this._clientCategoryFilters = clientCategoryFilters;

            this.autocomplete.clientCategoryFiltersChanged(
                oldValue,
                this._clientCategoryFilters
            );
            this.categorize.clientCategoryFiltersChanged(
                oldValue,
                this._clientCategoryFilters
            );
            this.find.clientCategoryFiltersChanged(
                oldValue,
                this._clientCategoryFilters
            );
        }
        this._clientCategoryFilters = clientCategoryFilters;
    }

    /**
     * Gets the currently active category expansion overrides.
     */
    get clientCategoryExpansion(): { [key: string]: boolean } {
        return this._clientCategoryExpansion;
    }

    /**
     * Sets the currently active category expansion overrides.
     */
    set clientCategoryExpansion(clientCategoryExpansion: {
        [key: string]: boolean;
    }) {
        if (clientCategoryExpansion !== this._clientCategoryExpansion) {
            const oldValue = this._clientCategoryExpansion;
            this._clientCategoryExpansion = clientCategoryExpansion;

            this.autocomplete.clientCategoryExpansionChanged(
                oldValue,
                this._clientCategoryExpansion
            );
            this.categorize.clientCategoryExpansionChanged(
                oldValue,
                this._clientCategoryExpansion
            );
            this.find.clientCategoryExpansionChanged(
                oldValue,
                this._clientCategoryExpansion
            );
        }
        this._clientCategoryExpansion = clientCategoryExpansion;
    }

    /**
     * Gets the currently active client-id value.
     */
    get clientId(): string {
        return this._query.clientId;
    }

    /**
     * Sets the currently active client-id.
     *
     * Will run trigger-checks and potentially update services.
     */
    set clientId(clientId: string) {
        if (clientId !== this._query.clientId) {
            const oldValue = this._query.clientId;
            this._query.clientId = clientId;

            this.autocomplete.clientIdChanged(oldValue, this._query);
            this.categorize.clientIdChanged(oldValue, this._query);
            this.find.clientIdChanged(oldValue, this._query);
        }
    }

    /**
     * Gets the currently active date-from value.
     */
    get dateFrom(): DateSpecification {
        return this._query.dateFrom;
    }

    /**
     * Sets the from-date for matches to be used.
     *
     * Will run trigger-checks and potentially update services.
     */
    set dateFrom(dateFrom: DateSpecification) {
        if (!deepEqual(dateFrom, this._query.dateFrom)) {
            const oldValue = Object.assign({}, this._query.dateFrom); // clone
            this._query.dateFrom = dateFrom;

            this.autocomplete.dateFromChanged(oldValue, this._query);
            this.categorize.dateFromChanged(oldValue, this._query);
            this.find.dateFromChanged(oldValue, this._query);
        }
    }

    /**
     * Gets the currently active date-to value.
     */
    get dateTo(): DateSpecification {
        return this._query.dateTo;
    }

    /**
     * Sets the to-date for matches to be used.
     *
     * Will run trigger-checks and potentially update services.
     */
    set dateTo(dateTo: DateSpecification) {
        if (!deepEqual(dateTo, this._query.dateTo)) {
            const oldValue = Object.assign({}, this._query.dateTo); // clone
            this._query.dateTo = dateTo;

            this.autocomplete.dateToChanged(oldValue, this._query);
            this.categorize.dateToChanged(oldValue, this._query);
            this.find.dateToChanged(oldValue, this._query);
        }
    }

    /**
     * Gets the currently active filters.
     */
    get filters(): Filter[] {
        return this._query.filters;
    }

    /**
     * Sets the filters to be used.
     *
     * Will run trigger-checks and potentially update services.
     */
    set filters(filters: Filter[]) {
        filters = filters || [];
        const sortedFilters = filters.sort();
        if (sortedFilters.join("") !== this._query.filters.join("")) {
            const oldValue = this._query.filters.slice(0); // clone
            this._query.filters = sortedFilters;

            this.autocomplete.filtersChanged(oldValue, this._query);
            this.categorize.filtersChanged(oldValue, this._query);
            this.find.filtersChanged(oldValue, this._query);
        }
    }

    /**
     * Returns true if the passed argument is a filter.
     */
    public isFilter(category: string[] | Category | Filter): boolean {
        const item = this.filterId(category);
        return item ? this.filterIndex(item) !== -1 : false;
    }

    public hasChildFilter(category: string[] | Category): boolean {
        const item = this.filterId(category);
        if (!item || this.filterIndex(item) !== -1) {
            return false;
        }
        const categoryPath = item.join("|");
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.filters.length; i++) {
            let filter = this.filters[i];
            let filterPath = filter.category.categoryName.join("|");
            if (filterPath.indexOf(categoryPath) === 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Add the given filter, if it isn't already there.
     *
     * Will run trigger-checks and potentially update services.
     */
    public filterAdd(filter: string[] | Category | Filter): boolean {
        const item = this.filterId(filter);
        const foundIndex = this.filterIndex(item);

        if (foundIndex === -1) {
            this.doFilterAdd(item);
            return true;
        }
        // Filter already set
        return false;
    }

    /**
     * Remove the given filter, if it is already set.
     *
     * Will run trigger-checks and potentially update services.
     */
    public filterRemove(filter: string[] | Category | Filter): boolean {
        const item = this.filterId(filter);
        const foundIndex = this.filterIndex(item);

        if (foundIndex > -1) {
            this.doFilterRemove(foundIndex);
            return true;
        }
        // Filter already set
        return false;
    }

    /**
     * Toggle the given filter.
     *
     * Will run trigger-checks and potentially update services.
     *
     * @param filter Is either string[], Filter or Category. When string array it expects the equivalent of the Category.categoryName property, which is like this: ["Author", "Normann"].
     * @return true if the filter was added, false if it was removed.
     */
    public filterToggle(filter: string[] | Category | Filter): boolean {
        const item = this.filterId(filter);
        const foundIndex = this.filterIndex(item);

        if (foundIndex > -1) {
            this.doFilterRemove(foundIndex);
            return false;
        } else {
            this.doFilterAdd(item);
            return true;
        }
    }

    public toggleCategoryExpansion(
        node: Category | Group,
        state?: boolean
    ): boolean {
        // Look up internal expansion-override list and see if we are already overriding this setting.
        const key = node.hasOwnProperty("categoryName")
            ? (node as Category).categoryName.join("|")
            : node.name;
        let newState =
            state !== undefined
                ? state
                : this.clientCategoryExpansion.hasOwnProperty(key)
                    ? !this.clientCategoryExpansion[key]
                    : !node.expanded;

        let newClientCategoryExpansion = { ...this.clientCategoryExpansion };
        newClientCategoryExpansion[key] = newState;
        this.clientCategoryExpansion = newClientCategoryExpansion;
        return newState;
    }
    /**
     * Gets the currently active match generateContent setting.
     */
    get matchGenerateContent(): boolean {
        return this._query.matchGenerateContent;
    }

    /**
     * Sets whether the results should generate the content or not.
     *
     * **Note:** Requires the backend IndexManager to have the option enabled in it's configuration too.
     *
     * Will run trigger-checks and potentially update services.
     */
    set matchGenerateContent(generateContent: boolean) {
        if (generateContent !== this._query.matchGenerateContent) {
            const oldValue = this._query.matchGenerateContent;
            this._query.matchGenerateContent = generateContent;

            this.autocomplete.matchGenerateContentChanged(
                oldValue,
                this._query
            );
            this.categorize.matchGenerateContentChanged(oldValue, this._query);
            this.find.matchGenerateContentChanged(oldValue, this._query);
        }
    }

    /**
     * Gets the currently active match generateContentHighlights setting.
     */
    get matchGenerateContentHighlights(): boolean {
        return this._query.matchGenerateContent;
    }

    /**
     * Sets whether the results should generate the content-highlight tags or not.
     *
     * **Note:** See the matchGenerateContent property in regards to IndexManager requirements.
     *
     * Will run trigger-checks and potentially update services.
     */
    set matchGenerateContentHighlights(generateContentHighlights: boolean) {
        if (
            generateContentHighlights !==
            this._query.matchGenerateContentHighlights
        ) {
            const oldValue = this._query.matchGenerateContentHighlights;
            this._query.matchGenerateContentHighlights = generateContentHighlights;

            this.autocomplete.matchGenerateContentHighlightsChanged(
                oldValue,
                this._query
            );
            this.categorize.matchGenerateContentHighlightsChanged(
                oldValue,
                this._query
            );
            this.find.matchGenerateContentHighlightsChanged(
                oldValue,
                this._query
            );
        }
    }

    /**
     * Gets the currently active match grouping mode.
     */
    get matchGrouping(): boolean {
        return this._query.matchGrouping;
    }

    /**
     * Sets whether the results should be grouped or not.
     *
     * **Note:** Requires the search-service to have the option enabled in it's configuration too.
     *
     * Will run trigger-checks and potentially update services.
     */
    set matchGrouping(useGrouping: boolean) {
        if (useGrouping !== this._query.matchGrouping) {
            const oldValue = this._query.matchGrouping;
            this._query.matchGrouping = useGrouping;

            this.autocomplete.matchGroupingChanged(oldValue, this._query);
            this.categorize.matchGroupingChanged(oldValue, this._query);
            this.find.matchGroupingChanged(oldValue, this._query);
        }
    }

    /**
     * Gets the currently active match-page.
     */
    get matchPage(): number {
        return this._query.matchPage;
    }

    /**
     * Sets the match-page to get.
     * Will run trigger-checks and potentially update services.
     */
    set matchPage(page: number) {
        if (page < 1) {
            throw new Error(
                '"matchPage" cannot be set to a value smaller than 1.'
            );
        }
        if (page !== this._query.matchPage) {
            const oldValue = this._query.matchPage;
            this._query.matchPage = page;

            this.autocomplete.matchPageChanged(oldValue, this._query);
            this.categorize.matchPageChanged(oldValue, this._query);
            this.find.matchPageChanged(oldValue, this._query);
        }
    }

    /**
     * Gets the previous page of match-results.
     * Will run trigger-checks and potentially update services.
     */
    public matchPagePrev(): boolean {
        // Cannot fetch page less than 0
        if (this._query.matchPage > 1) {
            this.matchPage--;
            return true;
        }
        return false;
    }

    /**
     * Gets the next page of match-results (if any).
     * Will run trigger-checks and potentially update services.
     */
    public matchPageNext(): boolean {
        this.matchPage++;
        return true;
    }

    /**
     * Gets the currently active match page-size.
     */
    get matchPageSize(): number {
        return this._query.matchPageSize;
    }

    /**
     * Sets the match page-size to be used.
     * Will run trigger-checks and potentially update services.
     */
    set matchPageSize(pageSize: number) {
        if (pageSize < 1) {
            throw new Error(
                '"matchPageSize" cannot be set to a value smaller than 1.'
            );
        }
        if (pageSize !== this._query.matchPageSize) {
            const oldValue = this._query.matchPageSize;
            this._query.matchPageSize = pageSize;

            this.autocomplete.matchPageSizeChanged(oldValue, this._query);
            this.categorize.matchPageSizeChanged(oldValue, this._query);
            this.find.matchPageSizeChanged(oldValue, this._query);
        }
    }

    /**
     * Gets the currently active match order.
     */
    get matchOrderBy(): OrderBy {
        return this._query.matchOrderBy;
    }

    /**
     * Sets the match sorting mode to be used.
     * Will run trigger-checks and potentially update services.
     */
    set matchOrderBy(orderBy: OrderBy) {
        if (orderBy !== this._query.matchOrderBy) {
            const oldValue = this._query.matchOrderBy;
            this._query.matchOrderBy = orderBy;

            this.autocomplete.matchOrderByChanged(oldValue, this._query);
            this.categorize.matchOrderByChanged(oldValue, this._query);
            this.find.matchOrderByChanged(oldValue, this._query);
        }
    }

    /**
     * Gets the currently active max number of autocomplete suggestions to get.
     */
    get maxSuggestions(): number {
        return this._query.maxSuggestions;
    }

    /**
     * Sets the max number of autocomplete suggestions to get.
     * Will run trigger-checks and potentially update services.
     */
    set maxSuggestions(maxSuggestions: number) {
        if (maxSuggestions < 0) {
            maxSuggestions = 0;
        }
        if (maxSuggestions !== this._query.maxSuggestions) {
            const oldValue = this._query.maxSuggestions;
            this._query.maxSuggestions = maxSuggestions;

            this.autocomplete.maxSuggestionsChanged(oldValue, this._query);
            this.categorize.maxSuggestionsChanged(oldValue, this._query);
            this.find.maxSuggestionsChanged(oldValue, this._query);
        }
    }

    /**
     * Returns the currently active query.
     */
    get query(): Query {
        return this._query;
    }

    /**
     * Sets the query to use.
     *
     * **Note:** Changing the `query` property will likely lead to multiple trigger-checks and potential updates.
     * This is because changing the whole value will lead to each of the query-objects' properties to trigger individual
     * events.
     *
     * To avoid multiple updates, call `deferUpdates(true)` before and deferUpdates(false) afterwards. Then at max
     * only one update will be generated.
     */
    set query(query: Query) {
        this.clientId = query.clientId;
        this.dateFrom = query.dateFrom;
        this.dateTo = query.dateTo;
        this.filters = query.filters;
        this.matchGrouping = query.matchGrouping;
        this.matchOrderBy = query.matchOrderBy;
        this.matchPage = query.matchPage;
        this.matchPageSize = query.matchPageSize;
        this.maxSuggestions = query.maxSuggestions;
        this.queryText = query.queryText;
        this.searchType = query.searchType;
    }

    /**
     * Gets the currently active query-object.
     */
    get queryText(): string {
        return this._query.queryText;
    }

    /**
     * Sets the query-text to be used.
     * Will run trigger-checks and potentially update services.
     */
    set queryText(queryText: string) {
        if (queryText !== this._query.queryText) {
            const oldValue = this._query.queryText;
            this._query.queryText = queryText;

            this.autocomplete.queryTextChanged(oldValue, this._query);
            this.categorize.queryTextChanged(oldValue, this._query);
            this.find.queryTextChanged(oldValue, this._query);
        }
    }

    /**
     * Gets the currently active search-type value.
     */
    get searchType(): SearchType {
        return this._query.searchType;
    }

    /**
     * Sets the search-type to be used.
     * Will run trigger-checks and potentially update services.
     */
    set searchType(searchType: SearchType) {
        if (searchType !== this._query.searchType) {
            const oldValue = this._query.searchType;
            this._query.searchType = searchType;

            this.autocomplete.searchTypeChanged(oldValue, this._query);
            this.categorize.searchTypeChanged(oldValue, this._query);
            this.find.searchTypeChanged(oldValue, this._query);
        }
    }

    /**
     * Gets the currently active match generateContent setting.
     */
    get uiLanguageCode(): string {
        return this._query.uiLanguageCode;
    }

    /**
     * Sets the language that the client uses. Affects category-names (and in the future maybe metadata too).
     * The expected values should be according to the https://www.wikiwand.com/en/IETF_language_tag standard.
     *
     * Changes will run trigger-checks and potentially update services.
     */
    set uiLanguageCode(uiLanguageCode: string) {
        if (uiLanguageCode !== this._query.uiLanguageCode) {
            const oldValue = this._query.uiLanguageCode;
            this._query.uiLanguageCode = uiLanguageCode;

            this.autocomplete.uiLanguageCodeChanged(oldValue, this._query);
            this.categorize.uiLanguageCodeChanged(oldValue, this._query);
            this.find.uiLanguageCodeChanged(oldValue, this._query);
        }
    }

    /**
     * Decides whether an update should be executed or not. Typically used to temporarily turn
     * off update-execution. When turned back on the second param can be used to indicate whether
     * pending updates should be executed or not.
     *
     * **Note:** Changes deferring of updates for all components (Autocomplete, Categorize and Find).
     * Use the service properties of the SearchClient instance to control deferring for each service.
     *
     * @example Some examples:
     *
     *     // Example 1: Defer updates to avoid multiple updates:
     *     searchClient.deferUpdates(true);
     *
     *     // Example 2: Change some props that triggers may be listening for
     *     searchClient.dateFrom = { M: -1};
     *     searchClient.dateTo = { M: 0};
     *     // When calling deferUpdates with (false) the above two update-events are now executed as one instead (both value-changes are accounted for though)
     *     searchClient.deferUpdates(false);
     *
     *     // Example 3: Suppress updates (via deferUpdates):
     *     searchClient.deferUpdates(true);
     *     // Change a prop that should trigger updates
     *     searchClient.queryText = "some text";
     *     // Call deferUpdates with (false, true), to skip the pending update.
     *     searchClient.deferUpdates(false, true);
     *
     *     // Example 4: Defer update only for one service (Categorize in this sample):
     *     searchClient.categorize.deferUpdates(true);
     *
     * @param state Turns on or off deferring of updates.
     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring
     * is turned off. The param is ignored for `state=true`. Default is false.
     */
    public deferUpdates(state: boolean, skipPending: boolean = false) {
        this.autocomplete.deferUpdates(state, skipPending);
        this.categorize.deferUpdates(state, skipPending);
        this.find.deferUpdates(state, skipPending);
    }

    /**
     * Find the category based on the category-name array.
     *
     * @param categoryName The category array that identifies the category.
     * @returns The Category object if found or null.
     */
    public findCategory(categoryName: string[]): Group | Category | null {
        return this.categorize.findCategory(categoryName);
    }

    private doFilterAdd(filter: string[]) {
        // Find item in categorize.categories, and build displayName for the Filter (displayName for each categoryNode in the hierarchy)
        const newFilter = this.categorize.createCategoryFilter(filter);
        const oldValue = this._query.filters.slice(0);

        let toRemove: Filter[] = [];

        // Find parent filters on the same path (to be removed)
        let filterName = newFilter.category.categoryName[0];
        for (let i = 1; i < newFilter.category.categoryName.length - 1; i++) {
            filterName += `|${newFilter.category.categoryName[i]}`;
            this._query.filters.forEach(f => {
                let fName = f.category.categoryName.join("|");
                if (fName === filterName) {
                    toRemove.push(f);
                }
            });
        }

        filterName += `|${
            newFilter.category.categoryName[
                newFilter.category.categoryName.length - 1
            ]
        }`;

        // Find child filters of the same path (to be removed)
        this._query.filters.forEach(f => {
            let fName = f.category.categoryName.join("|");
            if (fName.startsWith(filterName)) {
                toRemove.push(f);
            }
        });

        // Ecxecute the actual removel (wihthout triggering an update).
        toRemove.forEach(f => {
            this._query.filters.forEach((item, index) => {
                if (item === f) {
                    this._query.filters.splice(index, 1);
                }
            });
        });

        // Add the new filter
        this._query.filters.push(newFilter);
        this._query.filters.sort();

        this.autocomplete.filtersChanged(oldValue, this._query);
        this.categorize.filtersChanged(oldValue, this._query);
        this.find.filtersChanged(oldValue, this._query);
    }

    private doFilterRemove(i: number) {
        const oldValue = this._query.filters.slice(0);
        this._query.filters.splice(i, 1);

        // Note: No need to sort the filter-list afterwards, as removing an item cannot change the order anyway.

        this.autocomplete.filtersChanged(oldValue, this._query);
        this.categorize.filtersChanged(oldValue, this._query);
        this.find.filtersChanged(oldValue, this._query);

        return true;
    }

    private filterId(filter: string[] | Category | Filter): string[] {
        let id: string[];
        if (Array.isArray(filter)) {
            id = filter;
        } else if (filter instanceof Filter) {
            id = filter.category.categoryName;
        } else {
            id = filter.categoryName;
        }
        return id;
    }

    private filterIndex(filter: string[]): number {
        const filterString = filter.join("|");
        return this._query.filters.findIndex(
            f => f.category.categoryName.join("|") === filterString
        );
    }
}
