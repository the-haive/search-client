import { DateSpecification, Filter, OrderBy, IQuery, SearchType, CategorizationType } from '../Common';
import { IMatches } from "../Data";
import { IFindSettings } from './FindSettings';

export interface Find {

    settings: IFindSettings;

    deferUpdates(state: boolean, skipPending: boolean): void;

    requestObject(
        includeAuthorizationHeader: boolean
    ): RequestInit;

    update(
        query: IQuery,
        delay?: number,
        useQueryMatchPage?: boolean
    ): void;

    shouldUpdate(fieldName?: string, query?: IQuery): boolean;

    categorizationTypeChanged(
        oldValue: CategorizationType,
        query: IQuery
    ): void;

    maxSuggestionsChanged(oldValue: number, query: IQuery): void;

    fetch(
        query: IQuery,
        suppressCallbacks: boolean
    ): Promise<IMatches>;

    clientIdChanged(oldValue: string, query: IQuery): void;

    dateFromChanged(oldValue: DateSpecification, query: IQuery): void;

    dateToChanged(oldValue: DateSpecification, query: IQuery): void;

    filtersChanged(oldValue: Filter[], query: IQuery): void;

    matchGenerateContentChanged(oldValue: boolean, query: IQuery): void;
    matchGenerateContentHighlightsChanged(
        oldValue: boolean,
        query: IQuery
    ): void;
    matchGroupingChanged(oldValue: boolean, query: IQuery): void;
    matchOrderByChanged(oldValue: OrderBy, query: IQuery): void;
    matchPageChanged(oldValue: number, query: IQuery): void;
    matchPageSizeChanged(oldValue: number, query: IQuery): void;
    queryTextChanged(oldValue: string, query: IQuery): void;
    searchTypeChanged(oldValue: SearchType, query: IQuery): void;
    uiLanguageCodeChanged(oldValue: string, query: IQuery): void;
}