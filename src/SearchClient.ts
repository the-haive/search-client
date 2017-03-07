import * as equal from 'deep-equal';
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

    private query: Query;

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

        this.query = this.settings.query;
    }

    // public monitor(queryElm: Element) {
    //     throw Error("Not implemented yet!");
    // }

    get clientId(): string {
        return this.query.clientId;
    }

    set clientId(clientId: string) {
        if (clientId !== this.query.clientId) {
            let oldValue = this.query.clientId; 
            this.query.clientId = clientId;

            this.autocomplete.clientIdChanged(oldValue, this.query);
            this.categorize.clientIdChanged(oldValue, this.query);
            this.find.clientIdChanged(oldValue, this.query);
        }
    }

    get dateFrom(): DateSpecification {
        return this.query.dateFrom;
    }

    set dateFrom(dateFrom: DateSpecification) {
        if (!equal(dateFrom, this.query.dateFrom)) {
            let oldValue = Object.assign({}, this.query.dateFrom); // clone
            this.query.dateFrom = dateFrom;

            this.autocomplete.dateFromChanged(oldValue, this.query);
            this.categorize.dateFromChanged(oldValue, this.query);
            this.find.dateFromChanged(oldValue, this.query);
        }
    }

    get dateTo(): DateSpecification {
        return this.query.dateTo;
    }

    set dateTo(dateTo: DateSpecification) {
        if (!equal(dateTo, this.query.dateTo)) {
            let oldValue = Object.assign({}, this.query.dateTo); // clone
            this.query.dateTo = dateTo;

            this.autocomplete.dateToChanged(oldValue, this.query);
            this.categorize.dateToChanged(oldValue, this.query);
            this.find.dateToChanged(oldValue, this.query);
        }
    }

    get filters(): string[] {
        return this.query.filters;
    }

    set filters(filters: string[]) {
        filters = filters || [];
        let sortedFilters = filters.sort();
        if (sortedFilters.join('') !== this.query.filters.join('')) {
            let oldValue = this.query.filters.slice(0); // clone
            this.query.filters = sortedFilters;

            this.autocomplete.filtersChanged(oldValue, this.query);
            this.categorize.filtersChanged(oldValue, this.query);
            this.find.filtersChanged(oldValue, this.query);
        }
    }

    public filterAdd(filter: string): boolean {
        if (this.query.filters.indexOf(filter) === -1) {
            let oldValue = this.query.filters.slice(0);
            this.query.filters.push(filter);
            this.query.filters.sort();

            this.autocomplete.filtersChanged(oldValue, this.query);
            this.categorize.filtersChanged(oldValue, this.query);
            this.find.filtersChanged(oldValue, this.query);
            
            return true;
        } 
        // Filter already set
        return false;
    }

    public filterRemove(filter: string): boolean {
        const pos = this.query.filters.indexOf(filter);
        if (pos > -1) {
            let oldValue = this.query.filters.slice(0);
            this.query.filters.splice(pos, 1); 
            // Note: No need to sort the filter-list afterwards, as removing an item cannot change the order anyway.

            this.autocomplete.filtersChanged(oldValue, this.query);
            this.categorize.filtersChanged(oldValue, this.query);
            this.find.filtersChanged(oldValue, this.query);

            return true;
        } 
        // Filter already not set
        return false;
    }

    get matchGrouping(): boolean {
        return this.query.matchGrouping;
    }

    set matchGrouping(useGrouping: boolean) {
        if (useGrouping !== this.query.matchGrouping) {
            let oldValue = this.query.matchGrouping;
            this.query.matchGrouping = useGrouping;

            this.autocomplete.matchGroupingChanged(oldValue, this.query);
            this.categorize.matchGroupingChanged(oldValue, this.query);
            this.find.matchGroupingChanged(oldValue, this.query);
        }
    }

    get matchPage(): number {
        return this.query.matchPage;
    }

    set matchPage(page: number) {
        if (page < 0) {
            page = 0;
        }
        if (page !== this.query.matchPage) {
            let oldValue = this.query.matchPage;
            this.query.matchPage = page;

            this.autocomplete.matchPageChanged(oldValue, this.query);
            this.categorize.matchPageChanged(oldValue, this.query);
            this.find.matchPageChanged(oldValue, this.query);
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
        this.categorize.fetch(this.query);
        this.find.fetch(this.query);
    }

    public matchPagePrev(): boolean {
        if (this.query.matchPage > 0) {
            let oldValue = this.query.matchPage;
            this.query.matchPage--;

            this.autocomplete.matchPageChanged(oldValue, this.query);
            this.categorize.matchPageChanged(oldValue, this.query);
            this.find.matchPageChanged(oldValue, this.query);

            return true;
        }
        // Cannot fetch page less than 0
        return false;
    }

    public matchPageNext(): boolean {
        let oldValue = this.query.matchPage;
        this.query.matchPage++;

        this.autocomplete.matchPageChanged(oldValue, this.query);
        this.categorize.matchPageChanged(oldValue, this.query);
        this.find.matchPageChanged(oldValue, this.query);

        return true;
    }

    get matchPageSize(): number {
        return this.query.matchPageSize;
    }

    set matchPageSize(pageSize: number) {
        if (pageSize < 1) {
            pageSize = 1;
        }
        if (pageSize !== this.query.matchPageSize) {
            let oldValue = this.query.matchPageSize;
            this.query.matchPageSize = pageSize;

            this.autocomplete.matchPageSizeChanged(oldValue, this.query);
            this.categorize.matchPageSizeChanged(oldValue, this.query);
            this.find.matchPageSizeChanged(oldValue, this.query);
        }
    }

    get matchOrderBy(): OrderBy {
        return this.query.matchOrderBy;
    }

    set matchOrderBy(orderBy: OrderBy) {
        if (orderBy !== this.query.matchOrderBy) {
            let oldValue = this.query.matchOrderBy;
            this.query.matchOrderBy = orderBy;

            this.autocomplete.matchOrderByChanged(oldValue, this.query);
            this.categorize.matchOrderByChanged(oldValue, this.query);
            this.find.matchOrderByChanged(oldValue, this.query);
        }
    }

    get maxSuggestions(): number {
        return this.query.maxSuggestions;
    }

    set maxSuggestions(maxSuggestions: number) {
        if (maxSuggestions < 0) {
            maxSuggestions = 0;
        }
        if (maxSuggestions !== this.query.maxSuggestions) {
            let oldValue = this.query.maxSuggestions;
            this.query.maxSuggestions = maxSuggestions;

            this.autocomplete.maxSuggestionsChanged(oldValue, this.query);
            this.categorize.maxSuggestionsChanged(oldValue, this.query);
            this.find.maxSuggestionsChanged(oldValue, this.query);
        }
    }

    get queryText(): string {
        return this.query.queryText;
    }

    set queryText(queryText: string) {
        if (queryText !== this.query.queryText) {
            let oldValue = this.query.queryText;
            this.query.queryText = queryText;

            this.autocomplete.queryTextChanged(oldValue, this.query);
            this.categorize.queryTextChanged(oldValue, this.query);
            this.find.queryTextChanged(oldValue, this.query);
        }
    }

    get searchType(): SearchType {
        return this.query.searchType;
    }

    set searchType(searchType: SearchType) {
        if (searchType !== this.query.searchType) {
            let oldValue = this.query.searchType;
            this.query.searchType = searchType;

            this.autocomplete.searchTypeChanged(oldValue, this.query);
            this.categorize.searchTypeChanged(oldValue, this.query);
            this.find.searchTypeChanged(oldValue, this.query);
        }
    }
}
