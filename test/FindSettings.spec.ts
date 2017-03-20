// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { FindSettings } from '../src/Find';
import { Matches } from '../src/Data';

describe("FindSettings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new FindSettings();

        expect(settings).toBeDefined();
        expect(settings instanceof FindSettings).toBeTruthy();
        expect (settings.enabled).toBeTruthy();
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeUndefined();
        expect (settings.triggers.clientIdChanged).toEqual(true);
        expect (settings.triggers.dateFromChanged).toEqual(true);
        expect (settings.triggers.dateToChanged).toEqual(true);
        expect (settings.triggers.filterChanged).toEqual(true);
        expect (settings.triggers.matchGroupingChanged).toEqual(true);
        expect (settings.triggers.matchOrderByChanged).toEqual(true);
        expect (settings.triggers.matchPageChanged).toEqual(true);
        expect (settings.triggers.matchPageSizeChanged).toEqual(true);
        expect (settings.triggers.queryChangeDelay).toEqual(-1);
        expect (settings.triggers.queryChangeInstantRegex).toEqual(/\S\n$/);
        expect (settings.triggers.queryChange).toEqual(true);
        expect (settings.triggers.queryChangeMinLength).toEqual(2);
        expect (settings.triggers.searchTypeChanged).toEqual(true);
        expect (settings.url).toEqual("search/find");
    });

    it("Should be poassible to pass in an FindSettings object to use for values.", () => {
        let settings = {
            cbError: jest.fn(),
            cbRequest: jest.fn(),
            cbSuccess: jest.fn(),
            enabled: false,
            triggers: {
                clientIdChanged: false,
                dateFromChanged: false,
                dateToChanged: false,
                filterChanged: false,
                matchGroupingChanged: false,
                matchOrderByChanged: false,
                matchPageChanged: false,
                matchPageSizeChanged: false,
                queryChange: true,
                queryChangeDelay: 100,
                queryChangeInstantRegex: /\S/,
                queryChangeMinLength: 2,
                searchTypeChanged: false,
            },
            url: "/test/",
        } as FindSettings;

        settings = new FindSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof FindSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.triggers.clientIdChanged).toEqual(false);
        expect (settings.triggers.dateFromChanged).toEqual(false);
        expect (settings.triggers.dateToChanged).toEqual(false);
        expect (settings.triggers.filterChanged).toEqual(false);
        expect (settings.triggers.matchGroupingChanged).toEqual(false);
        expect (settings.triggers.matchOrderByChanged).toEqual(false);
        expect (settings.triggers.matchPageChanged).toEqual(false);
        expect (settings.triggers.matchPageSizeChanged).toEqual(false);
        expect (settings.triggers.queryChangeDelay).toEqual(100);
        expect (settings.triggers.queryChangeInstantRegex).toEqual(/\S/);
        expect (settings.triggers.queryChange).toEqual(true);
        expect (settings.triggers.queryChangeMinLength).toEqual(2);
        expect (settings.triggers.searchTypeChanged).toEqual(false);
        expect (settings.url).toEqual("test");
    });

    it("Should be poassible to pass a partial FindSettings object to use for values.", () => {
        let fnSuccess = (matches: Matches) => { /* dummy */};

        let settings = {
            cbSuccess: fnSuccess,
            enabled: false,
            triggers: {
                clientIdChanged: false,
                matchGroupingChanged: false,
            },
        } as FindSettings;

        settings = new FindSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof FindSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbRequest).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.triggers.clientIdChanged).toEqual(false);
        expect (settings.triggers.dateFromChanged).toEqual(true);
        expect (settings.triggers.dateToChanged).toEqual(true);
        expect (settings.triggers.filterChanged).toEqual(true);
        expect (settings.triggers.matchGroupingChanged).toEqual(false);
        expect (settings.triggers.matchOrderByChanged).toEqual(true);
        expect (settings.triggers.matchPageChanged).toEqual(true);
        expect (settings.triggers.matchPageSizeChanged).toEqual(true);
        expect (settings.triggers.queryChangeDelay).toEqual(-1);
        expect (settings.triggers.queryChangeInstantRegex).toEqual(/\S\n$/);
        expect (settings.triggers.queryChange).toEqual(true);
        expect (settings.triggers.queryChangeMinLength).toEqual(2);
        expect (settings.triggers.searchTypeChanged).toEqual(true);
        expect (settings.url).toEqual("search/find");
    });

});
