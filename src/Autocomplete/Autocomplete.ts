import { Query, CategorizationType, DateSpecification, Filter, SearchType, OrderBy } from "../Common";
import {    
    IAutocompleteSettings
} from "./AutocompleteSettings";

export interface Autocomplete {

    settings: IAutocompleteSettings;

    maxSuggestionsChanged(oldValue: number, query: Query): void;

    queryTextChanged(oldValue: string, query: Query): void;

    fetch(
        query: Query,
        suppressCallbacks: boolean
    ): Promise<string[]>;    

    categorizationTypeChanged(
        oldValue: CategorizationType,
        query: Query
    ): void;

    deferUpdates(state: boolean, skipPending: boolean): void;

    update(
        query: Query,
        delay?: number,
        useQueryMatchPage?: boolean
    ): void;

    shouldUpdate(fieldName?: string, query?: Query): boolean;

    clientIdChanged(oldValue: string, query: Query): void;

    dateFromChanged(oldValue: DateSpecification, query: Query): void;

    dateToChanged(oldValue: DateSpecification, query: Query): void;

    filtersChanged(oldValue: Filter[], query: Query): void;
        
    searchTypeChanged(oldValue: SearchType, query: Query): void;

    uiLanguageCodeChanged(oldValue: string, query: Query): void;

    matchGenerateContentChanged(oldValue: boolean, query: Query): void;
    matchGenerateContentHighlightsChanged(
        oldValue: boolean,
        query: Query
    ): void;
    matchGroupingChanged(oldValue: boolean, query: Query): void;
    matchOrderByChanged(oldValue: OrderBy, query: Query): void;
    matchPageChanged(oldValue: number, query: Query): void;
    matchPageSizeChanged(oldValue: number, query: Query): void;
}