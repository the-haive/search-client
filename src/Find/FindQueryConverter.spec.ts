import { Category } from '../Data';
import { Filter, OrderBy, Query, SearchType} from '../Common';
import { FindQueryConverter } from './FindQueryConverter';

const fixedQuery = new Query({
    clientId: 'mobile',
    dateFrom: '2017-03-13 09Z',
    dateTo: '2017-03-13 09Z',
    filters: [
        new Filter(
            ['Forfattere', 'Bob'],
            {
                categoryName: ['Authors', 'Bob'],
                displayName: 'Bob',
                count: 1,
                expanded: true,
                name: 'Bob',
            } as Category),
        new Filter(
            ['Filtype', 'Word'],
            {
                categoryName: ['FileTypes', 'docx'],
                displayName: 'Word',
                count: 1,
                expanded: true,
                name: 'docx',
            } as Category),
        ],
    matchGrouping: true,
    matchOrderBy: OrderBy.Date,
    matchPage: 1,
    matchPageSize: 20,
    maxSuggestions: 20,
    queryText: 'test',
    searchType: SearchType.Keywords,
});

describe('QueryConverters', () => {

    it('Should match expectations for REST V4 with default query', () => {
        let qc = new FindQueryConverter();
        let defaultQuery = new Query();
        const expectedFindUrl = 'http://localhost:9950/RestService/v4/search/find?g=false&gc=false&gch=true&o=Relevance&p=1&s=10&t=Keywords';

        expect(qc.getUrl('http://localhost:9950/RestService/v4', 'search/find', defaultQuery)).toEqual(expectedFindUrl);
        expect(qc.getUrl('http://localhost:9950/RestService/v4/', 'search/find', defaultQuery)).toEqual(expectedFindUrl);
    });

    it('Should match expectations for REST V4 with given query', () => {
      let qc = new FindQueryConverter();
      const expectedFindUrl = 'http://localhost:9950/RestService/v4/search/find?c=mobile&df=2017-03-13T09%3A00%3A00.000Z&dt=2017-03-13T09%3A00%3A00.000Z&f=Authors%7CBob%3BFileTypes%7Cdocx&g=true&gc=false&gch=true&o=Date&p=1&q=test&s=20&t=Keywords';

      expect(qc.getUrl('http://localhost:9950/RestService/v4', 'search/find', fixedQuery)).toEqual(expectedFindUrl);
      expect(qc.getUrl('http://localhost:9950/RestService/v4/', 'search/find', fixedQuery)).toEqual(expectedFindUrl);
    });

});
