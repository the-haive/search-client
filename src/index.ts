const test = require('tape').default;

if(process.env.NODE_ENV === 'ci') {
    test.onFinish(function(){
        window.close();
    });
}

import SearchClient, { Settings } from './search-client';


test('SearchClient initialization:', function(assert:any){
    // t.skip('t.skip')
    // t.comment('t.comment');
    // t.pass('t.pass');
    // t.fail('t.fail');
    // t.error(new Error('message error'), 't.error');
    // t.throws(function(){
    //     // throw new Error('YOLO')
    // }, 't.throw');
    // t.equal(3, 4, 't.deepEqual');
    // t.deepEqual({a:1, b:{c: 3}}, {a:1, b:{c: 2}}, 't.deepEqual');

    // t.test('t.timeout', function(tt){
    //     tt.timeoutAfter(50);
    //     setTimeout(function(){
    //         tt.end();
    //     }, 100);
    // });

    assert.throws(function(){
        let settings = new Settings();
        let searchClient = new SearchClient(settings);
    }, 'Does not allow missing baseServiceUrl.');

    assert.throws(function(){
        let settings = new Settings();
        settings.baseUrl = "http://myaccount.intellisearch:com";
        let searchClient = new SearchClient(settings);
    }, 'Should not allow for invalid url constructs (http://myaccount.intellisearch:com).');

    assert.doesNotThrow(function(){
        let settings = new Settings();
        settings.baseUrl = "http://myaccount.intellisearch.com";
        let searchClient = new SearchClient(settings);
        assert.equal(searchClient.allCategoriesUrl.toString(), "http://myaccount.intellisearch.com/search/allcategories", 'The allCategoriesUrl is not as expected.')
        assert.equal(searchClient.autocompleteUrl.toString(), "http://myaccount.intellisearch.com/autocomplete", 'The autocompleteUrl is not as expected.')
        assert.equal(searchClient.bestBetsUrl.toString(), "http://myaccount.intellisearch.com/manage/bestbets", 'The bestBetsUrl is not as expected.')
        assert.equal(searchClient.categorizeUrl.toString(), "http://myaccount.intellisearch.com/search/categorize", 'The categorizeUrl is not as expected.')
        assert.equal(searchClient.findUrl.toString(), "http://myaccount.intellisearch.com/search/find", 'The findUrl is not as expected.')
    }, 'Should allow with just the baseServiceUrl.');

    let settings = new Settings();
    settings.baseUrl = "http://localhost:3000";
    let searchClient = new SearchClient(settings);

    assert.end();
});