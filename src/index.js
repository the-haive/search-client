import test from 'tape';

if(process.env.NODE_ENV === 'ci') {
    test.onFinish(function(){
        window.close();
    });
}

import SearchClient from './search-client';


