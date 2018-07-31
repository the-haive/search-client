import { Query } from './Query';
import { CategorizationType } from './CategorizationType';
import { SearchType } from './SearchType';
import { OrderBy } from './OrderBy';
import { Filter } from './Filter';

describe('Query basics', () => {
    
    it('Should be able to create a query object with default values', () => {
        let query = new Query();

        expect(query).toBeDefined();
        expect(query instanceof Query).toBeTruthy();
        expect(query.clientId).toBe('');
        expect(query.categorizationType).toBe(CategorizationType.All);
        expect(query.dateFrom).toBeNull();
        expect(query.dateTo).toBeNull();
        expect(query.filters).toHaveLength(0);
        expect(query.matchGenerateContent).toBeFalsy();
        expect(query.matchGenerateContentHighlights).toBeTruthy();
        expect(query.matchGrouping).toBeFalsy();
        expect(query.matchOrderBy).toBe(OrderBy.Relevance);
        expect(query.matchPage).toBe(1);
        expect(query.matchPageSize).toBe(10);
        expect(query.maxSuggestions).toBe(10);
        expect(query.queryText).toBe('');
        expect(query.searchType).toBe(SearchType.Keywords);
        expect(query.uiLanguageCode).toBe('');
    });

    it('Should be able to create a query with overrides for all values', () => {
        let from = new Date(2018, 7, 30);
        let to = new Date(2018, 7, 31);
        let filters = [
            new Filter(['test'], {
            categoryName: ['test'],
            children: [],
            count: 1,
            displayName: 'test',
            expanded: true,
            name: 'test'
        })];
        let query = new Query({
            clientId: 'clientId',
            categorizationType: CategorizationType.DocumentHitsOnly,
            dateFrom: from,
            dateTo: to,
            filters,
            matchGenerateContent: true,
            matchGenerateContentHighlights: false,
            matchGrouping: true,
            matchOrderBy: OrderBy.Date,
            matchPage: 2,
            matchPageSize: 5,
            maxSuggestions: 5,
            queryText: 'find me',
            searchType: SearchType.Relevance,
            uiLanguageCode: 'no'
        });

        expect(query).toBeDefined();
        expect(query instanceof Query).toBeTruthy();

        expect(query.clientId).toBe('clientId');
        expect(query.categorizationType).toBe(CategorizationType.DocumentHitsOnly);
        expect(query.dateFrom).toEqual(from);
        expect(query.dateTo).toEqual(to);
        expect(query.filters).toEqual(filters);
        expect(query.matchGenerateContent).toBeTruthy();
        expect(query.matchGenerateContentHighlights).toBeFalsy();
        expect(query.matchGrouping).toBeTruthy();
        expect(query.matchOrderBy).toBe(OrderBy.Date);
        expect(query.matchPage).toBe(2);
        expect(query.matchPageSize).toBe(5);
        expect(query.maxSuggestions).toBe(5);
        expect(query.queryText).toBe('find me');
        expect(query.searchType).toBe(SearchType.Relevance);
        expect(query.uiLanguageCode).toBe('no');
    });

});
