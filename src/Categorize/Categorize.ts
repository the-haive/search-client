import {
    DateSpecification,
    Filter,
    Query,
    SearchType,

    CategorizationType,
    OrderBy
} from "../Common";
import { ICategories, ICategory, IGroup } from "../Data";
import { ICategorizeSettings } from './CategorizeSettings';

export interface Categorize {

    settings: ICategorizeSettings;

    maxSuggestionsChanged(oldValue: number, query: Query): void;

    fetch(
        query: Query,
        suppressCallbacks: boolean
    ): Promise<ICategories>;

    clientCategoriesUpdate(query: Query): void;

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

    findCategory(
        categoryName: string[],
        categories?: ICategories
    ): IGroup | ICategory | null;

    shouldUpdate(fieldName?: string, query?: Query): boolean;

    clientIdChanged(oldValue: string, query: Query): void;

    dateFromChanged(oldValue: DateSpecification, query: Query): void;

    dateToChanged(oldValue: DateSpecification, query: Query): void;

    filtersChanged(oldValue: Filter[], query: Query): void;

    queryTextChanged(oldValue: string, query: Query): void;
    
    searchTypeChanged(oldValue: SearchType, query: Query): void;

    uiLanguageCodeChanged(oldValue: string, query: Query): void;

    createCategoryFilter(categoryName: string[] | ICategory): Filter;

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