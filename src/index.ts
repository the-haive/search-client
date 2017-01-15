const test = require('tape').default;

if(process.env.NODE_ENV === 'ci') {
    test.onFinish(function(){
        window.close();
    });
}

import SearchClient, { Settings } from './search-client';


test('SearchClient initialization:', function(t:any){
    // t.skip('t.skip')
    // t.comment('t.comment');
    // t.pass('t.pass');
    // t.fail('t.fail');
    // t.error(new Error('message error'), 't.error');
    // t.throws(function(){
    //     // throw new Error('YOLO')
    // }, 't.throw');
    t.throws(function(){
        let settings = new Settings();
        let searchClient = new SearchClient(settings);
    }, 'Does not allow missing baseServiceUrl.');

    t.throws(function(){
        let settings = new Settings();
        settings.baseServiceUrl = '';
        let searchClient = new SearchClient(settings);
    }, 'Does not allow empty baseServiceUrl.');

    t.doesNotThrow(function(){
        let settings = new Settings();
        settings.baseServiceUrl = "http://myaccount.intellisearch.com/engine/";
        let searchClient = new SearchClient(settings);
    }, 'Should allow with just the baseServiceUrl.');


    // t.equal(3, 4, 't.deepEqual');
    // t.deepEqual({a:1, b:{c: 3}}, {a:1, b:{c: 2}}, 't.deepEqual');

    // t.test('t.timeout', function(tt){
    //     tt.timeoutAfter(50);
    //     setTimeout(function(){
    //         tt.end();
    //     }, 100);
    // });

    t.end();
});