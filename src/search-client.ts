const test = require('tape').default;
//import * as test from 'tape';
//import * as expect from 'expect';

export default class SearchClient {
    
}

test('IntelliSearch client initialization', function(t:any){
    // t.skip('t.skip')
    // t.comment('t.comment');
    // t.pass('t.pass');
    // t.fail('t.fail');
    // t.error(new Error('message error'), 't.error');
    // t.throws(function(){
    //     // throw new Error('YOLO')
    // }, 't.throw');
    t.doesNotThrow(function(){
        let searchClient = new SearchClient();
    }, 'can construct the wrapper');
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