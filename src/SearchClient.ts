import { Category } from './Data';
import equal = require('deep-equal');

export * from './Common';
export * from './Data';
export * from './Authentication';
export * from './AllCategories';
export * from './Autocomplete';
export * from './BestBets';
export * from './Categorize';
export * from './Find';
export * from './Settings';
export * from './QueryConverter';

import { OrderBy } from './Common/OrderBy';
import { SearchType } from './Common/SearchType';
import { Filter } from './Common/Filter';
import { DateSpecification, Query } from './Common/Query';

import { AuthToken } from './Authentication/AuthToken';
import { Authentication } from './Authentication/Authentication';

import { AllCategories } from './AllCategories/AllCategories';
import { Autocomplete } from './Autocomplete/Autocomplete';
import { AutocompleteSettings } from './Autocomplete/AutocompleteSettings';
import { AutocompleteTriggers } from './Autocomplete/AutocompleteTriggers';
import { BestBets } from './BestBets/BestBets';
import { Categorize } from './Categorize/Categorize';
import { Find } from './Find/Find';

import { Settings } from './Settings';

/**
 * This is the "main class" of this package. Please read the <a href="https://intellisearch.github.io/search-client/">getting-started section</a>" 
 * for a proper introduction.
 * 
 * The SearchClient manages a range of other services: 
 *   * AllCategories, 
 *   * Authentication, 
 *   * Autocomplete, 
 *   * BestBets, 
 *   * Categorize 
 *   * Find
 * 
 * Each of the above services can be used independently, but it is highly recommended to use the SearchClient instead.
 * 
 * The SearchClient allows you to have an advanced search with minimal effort in regards to setup and logics. instead
 * of having to write all the logics yourself the SearchClient exposes the following methods for managing your search:
 *   1. Configure callbacks in your settings-object that you pass to the SearchClient.
 *   2. Configure triggers to define when to do server-lookups and not (if you need to deviate from the defaults)
 *   3. Set query-values realtime (queryText, filters, date-ranges, etc.)
 *   4. Receive autocomplete-suggestions, matches and categories in your callback handlers when the data is available.
 * 
 * What happens is that any query-changes that arrive are checked in regards to trigger-settings. If they are to trigger 
 * and a callback has been set up then the server is requested and when the data is received it is sent to the callback 
 * registered in the settings-object.
 */
export class SearchClient implements AuthToken {

    /**
     * Holds a reference to the setup AllCategories service.
     */
    public allCategories: AllCategories = undefined;

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
     * Holds a reference to the setup BestBet service.
     */
    public bestBets: BestBets = undefined;

    /**
     * Holds a reference to the setup Categorize service.
     */
    public categorize: Categorize = undefined;
    
    /**
     * Holds a reference to the setup Find service.
     */
    public find: Find = undefined;

    // tslint:disable-next-line:variable-name
    private _clientCategoryFilters: { [ key: string ]: string | RegExp } = { };

    // tslint:disable-next-line:variable-name
    private _query: Query;

    /**
     * 
     * @param baseUrl The baseUrl for the IntelliSearch SearchService rest-service, typically http://server:9950/
     * @param settings A settings object that indicates how the search-client instance is to behave.
     */
    constructor(baseUrl: string, private settings: Settings = new Settings()) {
        settings = new Settings(settings);

        if (this.settings.allCategories.enabled) {
            this.allCategories = new AllCategories(baseUrl, this.settings.allCategories, this);
        }

        if (this.settings.authentication.enabled) {
            this.authentication = new Authentication(baseUrl, this.settings.authentication, this);
        }

        if (this.settings.autocomplete.enabled) {
            this.autocomplete = new Autocomplete(baseUrl, this.settings.autocomplete, this);
        }

        if (this.settings.bestBets.enabled) {
            this.bestBets = new BestBets(baseUrl, this.settings.bestBets, this);
        }

        if (this.settings.categorize.enabled) {
            this.categorize = new Categorize(baseUrl, this.settings.categorize, this);
        }

        if (this.settings.find.enabled) {
            this.find = new Find(baseUrl, this.settings.find, this);
        }

        this._query = this.settings.query;
    }

    /**
     * This method is typically called when the user clicks the search-button in the UI.
     * For query-fields that accepts enter the default queryChangeInstantRegex catches enter (for find and categorize).
     * When they don't take enter you will have to set up something that either catches the default enter or a user clicks
     * on a "Search"-button or similar. You can choose to use the already current query, or you can pass it in. If you
     * include the query then the internal updates are suppressed while changing the query-properties, to make sure that 
     * only one update per service is made (if any of their trigger-checks returned true). 
     * 
     * When called it will unconditionally call the fetch() method of both Categorize and Find.
     * 
     * Note: The Autocomplete fetch() method is not called, as it is deemed very unexpected to awnt to list autocomplete 
     * suggestions when the Search-button is clicked.
     */
    public findAndCategorize(query?: Query) {
        if (query) {
            this.deferUpdates(true);
            this.query = query;
            this.deferUpdates(false, true); // Skip any pending requests
        }
        this.categorize.fetch(this._query);
        this.find.fetch(this._query);
    }

    /**
     * Gets the currently registered regex-filters.
     */
    get clientCategoryFilters(): { [ key: string ]: string | RegExp } {
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
     *     let searchClient = new SearchClient("http://server:9950/");
     *     
     *     let searchClient.clientCategoryFilters = {
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
     *     let searchClient = new SearchClient("http://server:9950/");
     *     
     *     let searchClient.clientCategoryFilters = {
     *         // Show only Author-nodes with DisplayName that matches /john/.
     *         Author: /john/, 
     *         // Show only nodes in the System/File/Server node that matches /project/
     *         "System|File|Server": /project/,
     *     }
     * 
     */
    set clientCategoryFilters(clientCategoryFilters: { [ key: string ]: string | RegExp }) {
        if (clientCategoryFilters !== this._clientCategoryFilters) {
            let oldValue = this._clientCategoryFilters;
            this._clientCategoryFilters = clientCategoryFilters;

            this.autocomplete.clientCategoryFiltersChanged(oldValue, this._clientCategoryFilters);
            this.categorize.clientCategoryFiltersChanged(oldValue, this._clientCategoryFilters);
            this.find.clientCategoryFiltersChanged(oldValue, this._clientCategoryFilters);
        }
        this._clientCategoryFilters = clientCategoryFilters;
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
            let oldValue = this._query.clientId; 
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
        if (!equal(dateFrom, this._query.dateFrom)) {
            let oldValue = Object.assign({}, this._query.dateFrom); // clone
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
        if (!equal(dateTo, this._query.dateTo)) {
            let oldValue = Object.assign({}, this._query.dateTo); // clone
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
        let sortedFilters = filters.sort();
        if (sortedFilters.join('') !== this._query.filters.join('')) {
            let oldValue = this._query.filters.slice(0); // clone
            this._query.filters = sortedFilters;

            this.autocomplete.filtersChanged(oldValue, this._query);
            this.categorize.filtersChanged(oldValue, this._query);
            this.find.filtersChanged(oldValue, this._query);
        }
    }

    /**
     * Add the given filter, if it isn't already there. 
     * 
     * Will run trigger-checks and potentially update services.
     */
    public filterAdd(filter: string[] | Category | Filter): boolean {
        let item = this.filterId(filter);
        let foundIndex = this.filterIndex(item);

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
        let item = this.filterId(filter);
        let foundIndex = this.filterIndex(item);

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
        let item = this.filterId(filter);
        let foundIndex = this.filterIndex(item);
        
        if (foundIndex > -1) {
            this.doFilterRemove(foundIndex);
            return false;
        } else {
            this.doFilterAdd(item);
            return true;
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
            let oldValue = this._query.matchGrouping;
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
        if (page < 0) {
            page = 0;
        }
        if (page !== this._query.matchPage) {
            let oldValue = this._query.matchPage;
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
        if (this._query.matchPage > 0) {
            let oldValue = this._query.matchPage;
            this._query.matchPage--;

            this.autocomplete.matchPageChanged(oldValue, this._query);
            this.categorize.matchPageChanged(oldValue, this._query);
            this.find.matchPageChanged(oldValue, this._query);

            return true;
        }
        // Cannot fetch page less than 0
        return false;
    }

    /**
     * Gets the next page of match-results (if any). 
     * Will run trigger-checks and potentially update services.
     */
    public matchPageNext(): boolean {
        let oldValue = this._query.matchPage;
        this._query.matchPage++;

        this.autocomplete.matchPageChanged(oldValue, this._query);
        this.categorize.matchPageChanged(oldValue, this._query);
        this.find.matchPageChanged(oldValue, this._query);

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
            pageSize = 1;
        }
        if (pageSize !== this._query.matchPageSize) {
            let oldValue = this._query.matchPageSize;
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
            let oldValue = this._query.matchOrderBy;
            this._query.matchOrderBy = orderBy;

            this.autocomplete.matchOrderByChanged(oldValue, this._query);
            this.categorize.matchOrderByChanged(oldValue, this._query);
            this.find.matchOrderByChanged(oldValue, this._query);
        }
    }

    /** 
     * Gets the currently active max number of autopcomplete suggestions to get.
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
            let oldValue = this._query.maxSuggestions;
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
     * To avoid mutliple updates, call `deferUpdates(true)` before and deferUpdates(false) afterwards. Then at max
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
            let oldValue = this._query.queryText;
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
            let oldValue = this._query.searchType;
            this._query.searchType = searchType;

            this.autocomplete.searchTypeChanged(oldValue, this._query);
            this.categorize.searchTypeChanged(oldValue, this._query);
            this.find.searchTypeChanged(oldValue, this._query);
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
     *     // Exmaple 3: Suppress updates (via deferUpdates):
     *     searchClient.deferUpdates(true);
     *     // Change a prop that should trigger updates
     *     searchClient.queryText = "some text";
     *     // Call deferUpdates with (false, true), to skip the pending update.
     *     searchClient.deferUpdates(false, true);
     *     
     *     // Exmaple 4: Defer update only for one service (Categorize in this sample):
     *     searchClient.categorize.deferUpdates(true);
     * 
     * @param state Turns on or off deferring of updates.
     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring 
     * is turned off. The param is ignored for `state=true`.
     */
    public deferUpdates(state: boolean, skipPending: boolean = false) {
        this.autocomplete.deferUpdates(state, skipPending);
        this.categorize.deferUpdates(state, skipPending);
        this.find.deferUpdates(state, skipPending);
    }

    private doFilterAdd(filter: string[]) {
        // Find item in categorize.categories, and build displayName for the Filter (displayName for each categoryNode in the hierarchy)
        let newFilter = this.categorize.createCategoryFilter(filter);
        let oldValue = this._query.filters.slice(0);
        this._query.filters.push(newFilter);
        this._query.filters.sort();
        
        this.autocomplete.filtersChanged(oldValue, this._query);
        this.categorize.filtersChanged(oldValue, this._query);
        this.find.filtersChanged(oldValue, this._query);
    }

    private doFilterRemove(i: number) {
        let oldValue = this._query.filters.slice(0);
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
        return this._query.filters.findIndex((f) => f.category.categoryName.join("|") === filterString);
    }

}
