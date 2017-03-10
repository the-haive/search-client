import equal from 'deep-equal';
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
import { DeferUpdates } from './Common/DeferUpdates';

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
    public authenticationToken: string;

    public allCategories: AllCategories;

    public authentication: Authentication;

    public autocomplete: Autocomplete;

    public bestBets: BestBets;

    public categorize: Categorize;
    
    public find: Find;

    private _query: Query;

    private settings: Settings;
    
    constructor(baseUrl: string, settings?: Settings) {
        this.settings = new Settings(settings);

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

    // public monitor(queryElm: Element) {
    //     throw Error("Not implemented yet!");
    // }

    get query(): Query {
        return this._query;
    }

    set query(query: Query) {
        this.deferUpdates(true);
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
        this.defarUpdates(false);
    }

    get clientId(): string {
        return this._query.clientId;
    }

    set clientId(clientId: string) {
        if (clientId !== this._query.clientId) {
            let oldValue = this._query.clientId; 
            this._query.clientId = clientId;

            this.autocomplete.clientIdChanged(oldValue, this._query);
            this.categorize.clientIdChanged(oldValue, this._query);
            this.find.clientIdChanged(oldValue, this._query);
        }
    }

    get dateFrom(): DateSpecification {
        return this._query.dateFrom;
    }

    set dateFrom(dateFrom: DateSpecification) {
        if (!equal(dateFrom, this._query.dateFrom)) {
            let oldValue = Object.assign({}, this._query.dateFrom); // clone
            this._query.dateFrom = dateFrom;

            this.autocomplete.dateFromChanged(oldValue, this._query);
            this.categorize.dateFromChanged(oldValue, this._query);
            this.find.dateFromChanged(oldValue, this._query);
        }
    }

    get dateTo(): DateSpecification {
        return this._query.dateTo;
    }

    set dateTo(dateTo: DateSpecification) {
        if (!equal(dateTo, this._query.dateTo)) {
            let oldValue = Object.assign({}, this._query.dateTo); // clone
            this._query.dateTo = dateTo;

            this.autocomplete.dateToChanged(oldValue, this._query);
            this.categorize.dateToChanged(oldValue, this._query);
            this.find.dateToChanged(oldValue, this._query);
        }
    }

    get filters(): string[] {
        return this._query.filters;
    }

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

    get matchGrouping(): boolean {
        return this._query.matchGrouping;
    }

    set matchGrouping(useGrouping: boolean) {
        if (useGrouping !== this._query.matchGrouping) {
            let oldValue = this._query.matchGrouping;
            this._query.matchGrouping = useGrouping;

            this.autocomplete.matchGroupingChanged(oldValue, this._query);
            this.categorize.matchGroupingChanged(oldValue, this._query);
            this.find.matchGroupingChanged(oldValue, this._query);
        }
    }

    get matchPage(): number {
        return this._query.matchPage;
    }

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
     * on a "Search"-button or similar. The query is already updated (by other methods), so there should be no need to 
     * pass the query along, it should already be stored.
     * 
     * When called it will unconditionally call the fetch() method of both Categorize and Find.
     * 
     * Note: The Autocomplete fetch() method is not called, as it is deemed very unexpected to awnt to list autocomplete 
     * suggestions when the Search-button is clicked.
     */
    public go() {
        this.categorize.fetch(this._query);
        this.find.fetch(this._query);
    }

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

    public matchPageNext(): boolean {
        let oldValue = this._query.matchPage;
        this._query.matchPage++;

        this.autocomplete.matchPageChanged(oldValue, this._query);
        this.categorize.matchPageChanged(oldValue, this._query);
        this.find.matchPageChanged(oldValue, this._query);

        return true;
    }

    get matchPageSize(): number {
        return this._query.matchPageSize;
    }

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

    get matchOrderBy(): OrderBy {
        return this._query.matchOrderBy;
    }

    set matchOrderBy(orderBy: OrderBy) {
        if (orderBy !== this._query.matchOrderBy) {
            let oldValue = this._query.matchOrderBy;
            this._query.matchOrderBy = orderBy;

            this.autocomplete.matchOrderByChanged(oldValue, this._query);
            this.categorize.matchOrderByChanged(oldValue, this._query);
            this.find.matchOrderByChanged(oldValue, this._query);
        }
    }

    get maxSuggestions(): number {
        return this._query.maxSuggestions;
    }

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

    get queryText(): string {
        return this._query.queryText;
    }

    set queryText(queryText: string) {
        if (queryText !== this._query.queryText) {
            let oldValue = this._query.queryText;
            this._query.queryText = queryText;

            this.autocomplete.queryTextChanged(oldValue, this._query);
            this.categorize.queryTextChanged(oldValue, this._query);
            this.find.queryTextChanged(oldValue, this._query);
        }
    }

    get searchType(): SearchType {
        return this._query.searchType;
    }

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
     * Use to adjust how updates for the whether or not to execute updates, or to wait until  
     */
    public deferUpdates(state: DeferUpdates, components: Components = Components.All) {
        if (components === Components.All || components & Components.Autocomplete) {
            this.autocomplete.deferUpdates = state;
        }
        if (components === Components.All || components & Components.Categorize) {
            this.categorize.deferUpdates = state;
        }
        if (components === Components.All || components & Components.Find) {
            this.find.deferUpdates = state;
        }
    }
}
