import { DateSpecification, Filter, OrderBy, Query, SearchType, CategorizationType } from '../Common';
import { IMatches } from "../Data";
import { IFindSettings } from './FindSettings';

export interface Find {

    settings: IFindSettings;

    deferUpdates(state: boolean, skipPending: boolean): void;

    requestObject(
        includeAuthorizationHeader: boolean
    ): RequestInit;

    update(
        query: Query,
        delay?: number,
        useQueryMatchPage?: boolean
    ): void;

    shouldUpdate(fieldName?: string, query?: Query): boolean;

    categorizationTypeChanged(
        oldValue: CategorizationType,
        query: Query
    ): void;

    maxSuggestionsChanged(oldValue: number, query: Query): void;

    fetch(
        query: Query,
        suppressCallbacks: boolean
    ): Promise<IMatches>;

    clientIdChanged(oldValue: string, query: Query): void;

    dateFromChanged(oldValue: DateSpecification, query: Query): void;

    dateToChanged(oldValue: DateSpecification, query: Query): void;

    filtersChanged(oldValue: Filter[], query: Query): void;

    matchGenerateContentChanged(oldValue: boolean, query: Query): void;
    matchGenerateContentHighlightsChanged(
        oldValue: boolean,
        query: Query
    ): void;
    matchGroupingChanged(oldValue: boolean, query: Query): void;
    matchOrderByChanged(oldValue: OrderBy, query: Query): void;
    matchPageChanged(oldValue: number, query: Query): void;
    matchPageSizeChanged(oldValue: number, query: Query): void;
    queryTextChanged(oldValue: string, query: Query): void;
    searchTypeChanged(oldValue: SearchType, query: Query): void;
    uiLanguageCodeChanged(oldValue: string, query: Query): void;
}