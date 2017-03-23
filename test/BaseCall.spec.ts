// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

// Need this when running in node (not in browser), to make the domain-task resolve local-url's
import { baseUrl as dummyTestBaseUrl } from 'domain-task/fetch';

dummyTestBaseUrl('http://localhost'); // Relative URLs will be resolved against this

import { BaseCall } from '../src/Common/BaseCall';
import { Query } from '../src/Common/Query';
import { AllCategories } from '../src/AllCategories';
import { Authentication } from '../src/Authentication';
import { Autocomplete } from '../src/Autocomplete';
import { BestBets } from '../src/BestBets';
import { Categorize } from '../src/Categorize';
import { Find } from '../src/Find';

function test(TestClass: typeof BaseCall) {

    function instanceConstructor(): BaseCall<any> {
        switch (TestClass.name) {
            case AllCategories.name:
                return new AllCategories("http://localhost:9950/");
            case Authentication.name:
                return new Authentication("http://localhost:9950");
            case Autocomplete.name:
                return new Autocomplete("http://localhost:9950");
            case BestBets.name:
                return new BestBets("http://localhost:9950");
            case Categorize.name:
                return new Categorize("http://localhost:9950/");
            case Find.name:
                return new Find("http://localhost:9950");
            default:
                fail(`Unexpected TestClass: ${TestClass.name}`);
        }
    }

    describe(`Test BaseCall using instance of ${TestClass.name}`, () => {

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

        it("Should execute only one update when there are pending updates - when not deferring anymore", () => {
            let instance = instanceConstructor();
            let pInstance = (<any> instance);
            const mockFetch = jest.fn();
            pInstance.fetch = mockFetch;

            // Turn deferring on and off - and set up an pending update
            instance.deferUpdates(true); 
            instance.update(new Query({queryText: "test"} as Query));
            instance.update(new Query({queryText: "test2"} as Query));
            // Assuming not skipping => should execute, and to call update
            instance.deferUpdates(false); 
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith({
                clientId: "", 
                dateFrom: null, 
                dateTo: null, 
                filters: [], 
                matchGrouping: false, 
                matchOrderBy: 0, 
                matchPage: 0, 
                matchPageSize: 10, 
                maxSuggestions: 10, 
                queryText: "test2", 
                searchType: 0,
            }); 
            mockFetch.mockReset(); 

            // Turn deferring on and off - and set up an pending update
            instance.deferUpdates(true); 
            instance.update(new Query({queryText: "test"} as Query));
            instance.update(new Query({queryText: "test2"} as Query));
            // Forcing not skipping => should execute, and to call update
            instance.deferUpdates(false, false); 
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith({
                clientId: "", 
                dateFrom: null, 
                dateTo: null, 
                filters: [], 
                matchGrouping: false, 
                matchOrderBy: 0, 
                matchPage: 0, 
                matchPageSize: 10, 
                maxSuggestions: 10, 
                queryText: "test2", 
                searchType: 0,
            }); 
            mockFetch.mockReset();

            // Turn deferring on and off - and set up an pending update
            instance.deferUpdates(true); 
            instance.update(new Query({queryText: "test"} as Query));
            instance.update(new Query({queryText: "test2"} as Query));
            // Forcing skipping => should not execute (even if an update is pending)
            instance.deferUpdates(false, true); 
            expect(mockFetch).not.toBeCalled(); mockFetch.mockReset();
        });

    });

}

// Run tests for all the services
test(AllCategories);
test(Authentication);
test(Autocomplete);
test(BestBets);
test(Categorize);
test(Find);
