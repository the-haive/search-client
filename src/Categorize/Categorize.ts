import {
    DateSpecification,
    Filter,
    IQuery,
    SearchType,

    CategorizationType,
    OrderBy
} from "../Common";
import { ICategories, ICategory, IGroup } from "../Data";
import { ICategorizeSettings } from './CategorizeSettings';

export interface Categorize {

    settings: ICategorizeSettings;

    maxSuggestionsChanged(oldValue: number, query: IQuery): void;

    fetch(
        query: IQuery,
        suppressCallbacks: boolean
    ): Promise<ICategories>;

    clientCategoriesUpdate(query: IQuery): void;

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

    findCategory(
        categoryName: string[],
        categories?: ICategories
    ): IGroup | ICategory | null;

    shouldUpdate(fieldName?: string, query?: IQuery): boolean;

    clientIdChanged(oldValue: string, query: IQuery): void;

    dateFromChanged(oldValue: DateSpecification, query: IQuery): void;

    dateToChanged(oldValue: DateSpecification, query: IQuery): void;

    filtersChanged(oldValue: Filter[], query: IQuery): void;

    queryTextChanged(oldValue: string, query: IQuery): void;
    
    searchTypeChanged(oldValue: SearchType, query: IQuery): void;

    uiLanguageCodeChanged(oldValue: string, query: IQuery): void;

    createCategoryFilter(categoryName: string[] | ICategory): Filter;

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