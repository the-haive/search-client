import { IQuery, CategorizationType, DateSpecification, Filter, SearchType, OrderBy } from "../Common";
import {    
    IAutocompleteSettings
} from "./AutocompleteSettings";

export interface Autocomplete {

    settings: IAutocompleteSettings;

    maxSuggestionsChanged(oldValue: number, query: IQuery): void;

    queryTextChanged(oldValue: string, query: IQuery): void;

    fetch(
        query: IQuery,
        suppressCallbacks: boolean
    ): Promise<string[]>;    

    categorizationTypeChanged(
        oldValue: CategorizationType,
        query: IQuery
    ): void;

    deferUpdates(state: boolean, skipPending: boolean): void;

    update(
        query: IQuery,
        delay?: number,
        useQueryMatchPage?: boolean
    ): void;

    shouldUpdate(fieldName?: string, query?: IQuery): boolean;

    clientIdChanged(oldValue: string, query: IQuery): void;

    dateFromChanged(oldValue: DateSpecification, query: IQuery): void;

    dateToChanged(oldValue: DateSpecification, query: IQuery): void;

    filtersChanged(oldValue: Filter[], query: IQuery): void;
        
    searchTypeChanged(oldValue: SearchType, query: IQuery): void;

    uiLanguageCodeChanged(oldValue: string, query: IQuery): void;

    matchGenerateContentChanged(oldValue: boolean, query: IQuery): void;
    matchGenerateContentHighlightsChanged(
        oldValue: boolean,
        query: IQuery
    ): void;
    matchGroupingChanged(oldValue: boolean, query: IQuery): void;
    matchOrderByChanged(oldValue: OrderBy, query: IQuery): void;
    matchPageChanged(oldValue: number, query: IQuery): void;
    matchPageSizeChanged(oldValue: number, query: IQuery): void;
}