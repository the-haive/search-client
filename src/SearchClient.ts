import equal  = require('deep-equal');
export * from './Common';
export * from './Data';
export * from './Authentication';
export * from './AllCategories';
export * from './Autocomplete';
export * from './BestBets';
export * from './Categorize';
export * from './Find';

import { OrderBy } from './Common/OrderBy';
import { SearchType } from './Common/SearchType';
import { Settings } from './Common/Settings';
import { DateSpecification, Query } from './Common/Query';
import { Components } from './Common/Components';

import { AuthToken } from './Authentication/AuthToken';
import { Authentication } from './Authentication/Authentication';

import { AllCategories } from './AllCategories/AllCategories';
import { Autocomplete } from './Autocomplete/Autocomplete';
import { AutocompleteSettings } from './Autocomplete/AutocompleteSettings';
import { AutocompleteTrigger } from './Autocomplete/AutocompleteTrigger';
import { BestBets } from './BestBets/BestBets';
import { Categorize } from './Categorize/Categorize';
import { Find } from './Find/Find';

export class SearchClient implements AuthToken {

    /**
     * Holds a reference to the setup AllCategories service.
     */
    public allCategories: AllCategories;

    /**
     * Holds a reference to the setup Authentication service.
     */
    public authentication: Authentication;

    /**
     * Holds a reference to the currently set authentication token.
     */
    public authenticationToken: string;

    /**
     * Holds a reference to the setup Autocomplete service.
     */
    public autocomplete: Autocomplete;

    /**
     * Holds a reference to the setup BestBet service.
     */
    public bestBets: BestBets;

    /**
     * Holds a reference to the setup Categorize service.
     */
    public categorize: Categorize;
    
    /**
     * Holds a reference to the setup Find service.
     */
    public find: Find;

    // tslint:disable-next-line:variable-name
    private _query: Query;

    //private settings: Settings;
    
    /**
     * 
     * @param baseUrl The baseUrl for the IntelliSearch SearchService rest-service, typically http://server:9950/RestService/v3/
     * @param settings A settings object that indicates how the search-client instance is to behave.
     */
    constructor(baseUrl: string, private settings: Settings = new Settings()) {

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
     * Returns the currently active query.
     */
    get query(): Query {
        return this._query;
    }

    /**
     * Sets the query to use. 
     * Note: It will change one property at the time of the query-properties. This means that an update for the various 
     * services can be executed multiple times. To avoid this, call any of the `deferUpdates*(true)` methods before 
     * changing the query and then the same method with `(false)` to get only one update per service (if any triggered.
     * If you want to suppress all changes you can then on the second call pass `(false, true)` to indicate that any
     * pending updates are to be skipped.
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
     * Gets the currently active client-id value.
     */
    get clientId(): string {
        return this._query.clientId;
    }

    /**
     * Sets the currently active client-id. 
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
    get filters(): string[] {
        return this._query.filters;
    }

    /**
     * Sets the filters to be used. 
     * Will run trigger-checks and potentially update services.
     */
    set filters(filters: string[]) {
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
     * Will run trigger-checks and potentially update services.
     */
    public filterAdd(filter: string): boolean {
        if (this._query.filters.indexOf(filter) === -1) {
            let oldValue = this._query.filters.slice(0);
            this._query.filters.push(filter);
            this._query.filters.sort();

            this.autocomplete.filtersChanged(oldValue, this._query);
            this.categorize.filtersChanged(oldValue, this._query);
            this.find.filtersChanged(oldValue, this._query);
            
            return true;
        } 
        // Filter already set
        return false;
    }

    /**
     * Remove the given filter, if it is already set. 
     * Will run trigger-checks and potentially update services.
     */
    public filterRemove(filter: string): boolean {
        const pos = this._query.filters.indexOf(filter);
        if (pos > -1) {
            let oldValue = this._query.filters.slice(0);
            this._query.filters.splice(pos, 1); 
            // Note: No need to sort the filter-list afterwards, as removing an item cannot change the order anyway.

            this.autocomplete.filtersChanged(oldValue, this._query);
            this.categorize.filtersChanged(oldValue, this._query);
            this.find.filtersChanged(oldValue, this._query);

            return true;
        } 
        // Filter already not set
        return false;
    }

    /** 
     * Gets the currently active match grouping mode.
     */
    get matchGrouping(): boolean {
        return this._query.matchGrouping;
    }

    /**
     * Sets whether the results should be grouped or not 
     * Note: Requires the search-service to have the option enabled in it's configuration too.
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
            this.deferUpdatesForAll(true);
            this.query = query;
            this.deferUpdatesForAll(false, true); // Skip any pending requests
        }
        this.categorize.fetch(this._query);
        this.find.fetch(this._query);
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
     * Decides whether an update should be executed or not. Typically used to temporarily turn off update-execution. 
     * When turned back on the second param can be used to indicate whether pending updates should be executed or not.
     * Note: Changes deferring of updates for *ALL* components (Autocomplete, Categorize and Find).
     * 
     * @param state Turns on or off deferring of updates.
     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring is turned off. The param is ignored for state=true.
     */
    public deferUpdatesForAll(state: boolean, skipPending: boolean = false) {
        this.deferUpdatesForAutocomplete(state, skipPending);
        this.deferUpdatesForCategorize(state, skipPending);
        this.deferUpdatesForFind(state, skipPending);
    }

    /**
     * Decides whether an update should be executed or not. Typically used to temporarily turn off update-execution. 
     * When turned back on the second param can be used to indicate whether pending updates should be executed or not.
     * Note: Changes deferring of updates for the *Autocomplete* component.
     * 
     * @param state Turns on or off deferring of updates.
     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring is turned off. The param is ignored for state=true.
     */
    public deferUpdatesForAutocomplete(state: boolean, skipPending: boolean = false) {
        this.autocomplete.deferUpdates(state, skipPending);
    }

    /**
     * Decides whether an update should be executed or not. Typically used to temporarily turn off update-execution. 
     * When turned back on the second param can be used to indicate whether pending updates should be executed or not.
     * Note: Changes deferring of updates for the *Categorize* component.
     * 
     * @param state Turns on or off deferring of updates.
     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring is turned off. The param is ignored for state=true.
     */
    public deferUpdatesForCategorize(state: boolean, skipPending: boolean = false) {
        this.categorize.deferUpdates(state, skipPending);
    }

    /**
     * Decides whether an update should be executed or not. Typically used to temporarily turn off update-execution. 
     * When turned back on the second param can be used to indicate whether pending updates should be executed or not.
     * Note: Changes deferring of updates for the *Find* component.
     * 
     * @param state Turns on or off deferring of updates.
     * @param skipPending Used to indicate if a pending update is to be executed or skipped when deferring is turned off. The param is ignored for state=true.
     */
    public deferUpdatesForFind(state: boolean, skipPending: boolean = false) {
        this.find.deferUpdates(state, skipPending);
    }

}
