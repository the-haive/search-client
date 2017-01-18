const test = require('tape').default;

if(process.env.NODE_ENV === 'ci') {
    test.onFinish(function(){
        window.close();
    });
}

import SearchClient from './search-client';

test('Test initialization:', function (assert:any) {

    assert.throws(function(){
        let searchClient = new SearchClient("");
    }, 'Does not allow empty baseServiceUrl.');

    assert.throws(function(){
        let searchClient = new SearchClient("http://myaccount.intellisearch:com");
    }, 'Should not allow for invalid url constructs (http://myaccount.intellisearch:com).');

    assert.doesNotThrow(function(){
        let searchClient = new SearchClient("http://myaccount.intellisearch.com");
        assert.equal(searchClient.allCategoriesUrl.toString(), "http://myaccount.intellisearch.com/search/allcategories", 'The allCategoriesUrl is not as expected.')
        assert.equal(searchClient.autocompleteUrl.toString(), "http://myaccount.intellisearch.com/autocomplete", 'The autocompleteUrl is not as expected.')
        assert.equal(searchClient.bestBetsUrl.toString(), "http://myaccount.intellisearch.com/manage/bestbets", 'The bestBetsUrl is not as expected.')
        assert.equal(searchClient.categorizeUrl.toString(), "http://myaccount.intellisearch.com/search/categorize", 'The categorizeUrl is not as expected.')
        assert.equal(searchClient.findUrl.toString(), "http://myaccount.intellisearch.com/search/find", 'The findUrl is not as expected.')
    }, 'Should allow with just the baseServiceUrl.');
    
    assert.end();
});

test('Test find()', function (assert:any) {
    assert.doesNotThrow(function(){
        let searchClient = new SearchClient("http://localhost:3000");
        searchClient.find({}).then((matches)=>{
            assert.equal(matches.estimatedMatchCount, 101, "Did receive 101 matches.");
            assert.end();
            return Promise.resolve();
        }).catch((reason)=>{
            assert.fail(`${reason}`);
            assert.end();
            return Promise.resolve();
        });
    }, "Init for find");
});