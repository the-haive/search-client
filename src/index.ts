const test = require('tape').default;

if(process.env.NODE_ENV === 'ci') {
    test.onFinish(function(){
        window.close();
    });
}

import { SearchClient, Query, SearchType, OrderBy } from './search-client';

test('Test initialization:', function (assert: any) {

    assert.throws(function(){
        let searchClient = new SearchClient("");
    }, 'Does not allow empty baseServiceUrl.');

    assert.throws(function(){
        let searchClient = new SearchClient("http://myaccount.intellisearch:com");
    }, 'Should not allow for invalid url constructs (http://myaccount.intellisearch:com).');

    assert.doesNotThrow(function(){
        let searchClient = new SearchClient("http://myaccount.intellisearch.com");
        assert.equal(searchClient.allCategoriesUrl.toString(), "http://myaccount.intellisearch.com/search/allcategories", 'The allCategoriesUrl is as expected.')
        assert.equal(searchClient.autocompleteUrl.toString(), "http://myaccount.intellisearch.com/autocomplete", 'The autocompleteUrl is as expected.')
        assert.equal(searchClient.bestBetsUrl.toString(), "http://myaccount.intellisearch.com/manage/bestbets", 'The bestBetsUrl is as expected.')
        assert.equal(searchClient.categorizeUrl.toString(), "http://myaccount.intellisearch.com/search/categorize", 'The categorizeUrl is as expected.')
        assert.equal(searchClient.findUrl.toString(), "http://myaccount.intellisearch.com/search/find", 'The findUrl is as expected.')
    }, 'Should allow with just the baseServiceUrl.');
    
    assert.end();
});

test('Test find(), with callback from settings', function (assert: any) {
    try {
        assert.test((assert: any) => {
            let searchClient = new SearchClient("http://localhost:3000", {
                callback: {
                    find: (matches) => {
                        assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches in the settings find callback-handler.");
                    }
                }
            });
            searchClient.find(new Query())
            .then((matches)=>{
                assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches as a resolved promise.");
                assert.end();
                return Promise.resolve();
            })
            .catch((reason)=>{
                assert.fail(`${reason}`);
                assert.end();
                return Promise.resolve();
            });
        }, "Execute promise-based search");
    } catch(e){
        assert.fail(`Throws exception: ${e}`);
    } finally{
        assert.end()
    }
});

test('Test categorize(), with callback from settings', function (assert: any) {
    try {
        assert.test((assert: any) => {
            let searchClient = new SearchClient("http://localhost:3000", {
                callback: {
                    categorize: (matches) => {
                        assert.equal(matches.matchCount, 101, "Did receive 101 matches in the settings categorize callback-handler.");
                    }
                }
            });
            searchClient.categorize(new Query)
            .then((categories)=>{
                assert.equal(categories.matchCount, 101, "Did receive 101 matches as a resolved promise.");
                assert.end();
                return Promise.resolve();
            })
            .catch((reason)=>{
                assert.fail(`${reason}`);
                assert.end();
                return Promise.resolve();
            });
        }, "Execute promise-based search");
    } catch(e){
        assert.fail(`Throws exception: ${e}`);
    } finally{
        assert.end()
    }
});

test('Test find(), with override callback', function (assert: any) {
    try {
        assert.test((assert: any) => {
            let searchClient = new SearchClient("http://localhost:3000", {
                callback: {
                    find: (matches) => {
                        assert.fail("Should not call the settings find callback-handler.");
                    }
                }
            });
            searchClient.find(new Query(), (matches) => { 
                assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches in the override find callback-handler.") 
            })
            .then((matches)=>{
                assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches as a resolved promise.");
                assert.end();
                return Promise.resolve();
            })
            .catch((reason)=>{
                assert.fail(`${reason}`);
                assert.end();
                return Promise.resolve();
            });
        }, "Execute promise-based search");
    } catch(e){
        assert.fail(`Throws exception: ${e}`);
    } finally{
        assert.end()
    }
});

test('Test categorize(), with override callback', function (assert: any) {
    try {
        assert.test((assert: any)=>{
            let searchClient = new SearchClient("http://localhost:3000", {
                callback: {
                    categorize: (categories) => {
                        assert.fail("Should not call the settings categorize callback-handler.");
                    }
                }
            });
            searchClient.categorize(new Query, (categories) => { 
                assert.equal(categories.matchCount, 101, "Did receive 101 matches in the override categorize callback-handler.") 
            })
            .then((categories)=>{
                assert.equal(categories.matchCount, 101, "Did receive 101 matches as a resolved promise.");
                assert.end();
                return Promise.resolve();
            }).catch((reason)=>{
                assert.fail(`${reason}`);
                assert.end();
                return Promise.resolve();
            });
        }, "Execute promise-based search");
    } catch(e){
        assert.fail(`Throws exception: ${e}`);
    } finally{
        assert.end()
    }
});

test('Test find(), with override callback only', function (assert: any) {
    try {
        assert.test((assert: any) => {
            let searchClient = new SearchClient("http://localhost:3000");
            searchClient.find(new Query(), (matches) => { 
                assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches in the override find callback-handler.");
                assert.end();
            }).catch((reason)=>{
                assert.fail(`${reason}`);
                assert.end();
                return Promise.resolve();
            });
        }, "Execute promise-based search");
    } catch(e){
        assert.fail(`Throws exception: ${e}`);
    } finally{
        assert.end()
    }
});

test('Test categorize(), with override callback only', function (assert: any) {
    try {
        assert.test((assert: any) => {
            let searchClient = new SearchClient("http://localhost:3000");
            searchClient.categorize(new Query, (categories) => { 
                assert.equal(categories.matchCount, 101, "Did receive 101 matches in the override categorize callback-handler.");
                assert.end();
            })
            .catch((reason)=>{
                assert.fail(`${reason}`);
                assert.end();
                return Promise.resolve();
            });
        }, "Execute promise-based search");
    } catch(e){
        assert.fail(`Throws exception: ${e}`);
    } finally{
        assert.end()
    }
});

test('Test Query constructor params', function (assert: any) {
    try {
        let query = new Query(
            "test",
            SearchType.Relevance,
            ["System/Exchange/Mailbox", "System/File/Fileshare1"],
            new Date(2016, 1, 1),
            new Date(2017, 1, 27),
            "mobile",
            5,
            2,
            true,
            OrderBy.Relevance,
        );
        assert.equal(query.toFindUrlParam(), "?q=test&t=Relevance&f=System/Exchange/Mailbox;System/File/Fileshare1&df=2016-01-31T23:00:00.000Z&dt=2017-02-26T23:00:00.000Z&c=mobile&s=5&p=2&g=true&o=Relevance", "Query is serialized as url param for find() as expected.");
        assert.equal(query.toCategorizeUrlParam(), "?q=test&t=Relevance&f=System/Exchange/Mailbox;System/File/Fileshare1&df=2016-01-31T23:00:00.000Z&dt=2017-02-26T23:00:00.000Z&c=mobile", "Query is serialized as url param for categorize() as expected.");
        assert.test((assert: any) =>{
            let searchClient = new SearchClient("http://localhost:3000");
            searchClient.find(query, (matches) => { 
                assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches in the override find callback-handler.");
            })
            .then((matches)=>{
                assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches as a resolved promise.");
                assert.end();
                return Promise.resolve();
            })
            .catch((reason)=>{
                assert.fail(`${reason}`);
                assert.end();
                return Promise.resolve();
            });
        }, "Execute promise-based search");
    } catch(e){
        assert.fail(`Throws exception: ${e}`);
    } finally{
        assert.end()
    }
});

test('Test Query property setters', function (assert: any) {
    let query: Query;
    try {
        query = new Query();
        query.queryText = "test";
        query.searchType = SearchType.Relevance;
        query.filters = ["System/Exchange/Mailbox", "System/File/Fileshare1"];
        query.from = new Date(2016, 1, 1);
        query.to = new Date(2017, 1, 27);
        query.clientId = "mobile";
        query.pageSize = 5;
        query.page = 2;
        query.useGrouping = true;
        query.orderBy = OrderBy.Relevance;

        assert.equal(query.toFindUrlParam(), "?q=test&t=Relevance&f=System/Exchange/Mailbox;System/File/Fileshare1&df=2016-01-31T23:00:00.000Z&dt=2017-02-26T23:00:00.000Z&c=mobile&s=5&p=2&g=true&o=Relevance", "Query is serialized as url param for find() as expected.");
        assert.equal(query.toCategorizeUrlParam(), "?q=test&t=Relevance&f=System/Exchange/Mailbox;System/File/Fileshare1&df=2016-01-31T23:00:00.000Z&dt=2017-02-26T23:00:00.000Z&c=mobile", "Query is serialized as url param for categorize() as expected.");

        assert.test((assert: any) => {
            let searchClient = new SearchClient("http://localhost:3000");
            searchClient.find(query, (matches) => { 
                assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches in the override find callback-handler.");
            })
            .then((matches)=>{
                assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches as a resolved promise.");
                assert.end()
                return Promise.resolve();
            })
            .catch((reason)=>{
                assert.fail(`${reason}`);
                assert.end()
                return Promise.resolve();
            });
        }, "Execute promise-based search")
    } catch(e) {
        assert.fail(`Throws exception: ${e}`);
    } finally {
        assert.end()
    }
});

test('Test Query constructor as json object', function (assert: any) {
    let query: Query;
    try {
        query = new Query({
            queryText: "test",
            searchType: SearchType.Relevance,
            filters: ["System/Exchange/Mailbox", "System/File/Fileshare1"],
            from: new Date(2016, 1, 1),
            to: new Date(2017, 1, 27),
            clientId: "mobile",
            pageSize: 5,
            page: 2,
            useGrouping: true,
            orderBy: OrderBy.Relevance
        });

        assert.equal(query.toFindUrlParam(), "?q=test&t=Relevance&f=System/Exchange/Mailbox;System/File/Fileshare1&df=2016-01-31T23:00:00.000Z&dt=2017-02-26T23:00:00.000Z&c=mobile&s=5&p=2&g=true&o=Relevance", "Query is serialized as url param for find() as expected.");
        assert.equal(query.toCategorizeUrlParam(), "?q=test&t=Relevance&f=System/Exchange/Mailbox;System/File/Fileshare1&df=2016-01-31T23:00:00.000Z&dt=2017-02-26T23:00:00.000Z&c=mobile", "Query is serialized as url param for categorize() as expected.");

        assert.test((assert: any) => {
            let searchClient = new SearchClient("http://localhost:3000");
            searchClient.find(query, (matches) => { 
                assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches in the override find callback-handler.");
            })
            .then((matches)=>{
                assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches as a resolved promise.");
                assert.end()
                return Promise.resolve();
            })
            .catch((reason)=>{
                assert.fail(`${reason}`);
                assert.end()
                return Promise.resolve();
            });

        }, "Execute promise-based search")
    } catch(e) {
        assert.fail(`Throws exception: ${e}`);
    } finally {
        assert.end()
    }
});

