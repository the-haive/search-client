// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';

dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { BaseCall } from '../src/Common/BaseCall';
import { Query } from '../src/Common/Query';
import { Autocomplete } from '../src/Autocomplete';
import { Categorize } from '../src/Categorize';
import { Find } from '../src/Find';

function test(TestClass: typeof Autocomplete | typeof Categorize | typeof Find) {
    function instanceConstructor(): BaseCall {
        if (TestClass.name === "Autocomplete") {
            return new Autocomplete("http://localhost:9950/RestService/v3/");
        } else if (TestClass.name === "Categorize") {
            return new Categorize("http://localhost:9950/RestService/v3/");
        } else {
            return new Find("http://localhost:9950/RestService/v3/");
        }
    }

    it("Should have sound deferUpdate defaults", () => {
        let instance = instanceConstructor();
        let pInstance = (<any> instance);
        const mockFetch = jest.fn();
        pInstance.fetch = mockFetch;

        // Verify defaults
        expect(pInstance.deferUpdate).toEqual(false);
        expect(pInstance.deferredQuery).toBeUndefined();

        // Execute an update and verify that values and calls are as expected
        instance.update(new Query({queryText: "test"} as Query));
        expect(mockFetch).toBeCalled(); mockFetch.mockReset();
        expect(pInstance.deferredQuery).toBeUndefined();
    });

    it("Should not update when deferUpdate is on", () => {
        let instance = instanceConstructor();
        let pInstance = (<any> instance);
        const mockFetch = jest.fn();
        pInstance.fetch = mockFetch;

        // Turn on deferring 
        instance.deferUpdates(true); 
        // Execute an update and verify that values and calls are as expected
        instance.update(new Query({queryText: "test"} as Query));
        expect(mockFetch).not.toBeCalled(); mockFetch.mockReset();
        expect(pInstance.deferredQuery.queryText).toEqual("test");
    });

    it("Should not execute updates when deferring is on, but persist the deferredQuery for later use", () => {
        let instance = instanceConstructor();
        let pInstance = (<any> instance);
        const mockFetch = jest.fn();
        pInstance.fetch = mockFetch;

        // Turn on deferring 
        instance.deferUpdates(true); 
        expect(pInstance.deferUpdate).toEqual(true);
        expect(pInstance.deferredQuery).toBeUndefined();
        expect(mockFetch).not.toBeCalled();

        instance.update(new Query({queryText: "test"} as Query));
        expect(mockFetch).not.toBeCalled();
        expect(pInstance.deferredQuery.queryText).toEqual("test");
    });

    it("Should not execute updates when there are no pending updates - when not deferring anymore", () => {
        let instance = instanceConstructor();
        let pInstance = (<any> instance);
        const mockFetch = jest.fn();
        pInstance.fetch = mockFetch;

        // Turn deferring on and off
        instance.deferUpdates(true); 
        instance.deferUpdates(false); // Assuming not skipping => should execute, but no updates pending
        expect(pInstance.deferUpdate).toEqual(false);
        expect(pInstance.deferredQuery).toBeUndefined();
        expect(mockFetch).not.toBeCalled(); mockFetch.mockReset();

        // Turn deferring on and off
        instance.deferUpdates(true); 
        instance.deferUpdates(false, false); // Forcing not skipping => should execute, but no updates pending
        expect(pInstance.deferUpdate).toEqual(false);
        expect(pInstance.deferredQuery).toBeUndefined();
        expect(mockFetch).not.toBeCalled(); mockFetch.mockReset();

        // Turn deferring on and off
        instance.deferUpdates(true); 
        instance.deferUpdates(false, true); // Forcing skipping => should not execute (and no update pending anyway)
        expect(pInstance.deferUpdate).toEqual(false);
        expect(pInstance.deferredQuery).toBeUndefined();
        expect(mockFetch).not.toBeCalled(); mockFetch.mockReset();
    });

    it("Should execute updates when there are pending updates - when not deferring anymore", () => {
        let instance = instanceConstructor();
        let pInstance = (<any> instance);
        const mockFetch = jest.fn();
        pInstance.fetch = mockFetch;

        // Turn deferring on and off - and set up an pending update
        instance.deferUpdates(true); 
        instance.update(new Query({queryText: "test"} as Query));
        instance.deferUpdates(false); // Assuming not skipping => should execute, and to call update
        expect(mockFetch).toBeCalled(); mockFetch.mockReset(); 

        // Turn deferring on and off - and set up an pending update
        instance.deferUpdates(true); 
        instance.update(new Query({queryText: "test"} as Query));
        instance.deferUpdates(false, false); // Forcing not skipping => should execute, and to call update
        expect(mockFetch).toBeCalled(); mockFetch.mockReset();

        // Turn deferring on and off - and set up an pending update
        instance.deferUpdates(true); 
        instance.update(new Query({queryText: "test"} as Query));
        instance.deferUpdates(false, true); // Forcing skipping => should not execute (even if an update is pending)
        expect(mockFetch).not.toBeCalled(); mockFetch.mockReset();
    });
}

test(Autocomplete);
test(Categorize);
test(Find);
