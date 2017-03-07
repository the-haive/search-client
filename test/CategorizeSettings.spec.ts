// tslint:disable-next-line:no-var-requires
require("babel-core/register");
require("babel-polyfill");

import { CategorizeSettings } from '../src/Categorize';
import { Categories } from '../src/Data';

describe("CategorizeSettings basics", () => {
    it("Should be able to create a default settings object with expected values", () => {
        let settings = new CategorizeSettings();

        expect(settings).toBeDefined();
        expect(settings instanceof CategorizeSettings).toBeTruthy();
        expect (settings.enabled).toBeTruthy();
        expect (settings.cbBusy).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeUndefined();
        expect (settings.trigger.clientIdChanged).toEqual(true);
        expect (settings.trigger.dateFromChanged).toEqual(true);
        expect (settings.trigger.dateToChanged).toEqual(true);
        expect (settings.trigger.filterChanged).toEqual(true);
        expect (settings.trigger.queryChangeDelay).toEqual(-1);
        expect (settings.trigger.queryChangeInstantRegex).toEqual(/\S\n$/);
        expect (settings.trigger.queryChange).toEqual(true);
        expect (settings.trigger.queryChangeMinLength).toEqual(2);
        expect (settings.trigger.searchTypeChanged).toEqual(true);
        expect (settings.url).toEqual("/search/categorize");
    });

    it("Should be poassible to pass in an CategorizeSettings object to use for values.", () => {
        let fnBusy = (isBusy: boolean, url: string, reqInit: RequestInit) => { /* dummy */};
        let fnError = (error: any) => { /* dummy */};
        let fnSuccess = (categories: Categories) => { /* dummy */};

        let settings = {
            cbBusy: fnBusy,
            cbError: fnError,
            cbSuccess: fnSuccess,
            enabled: false,
            trigger: {
                clientIdChanged: false,
                dateFromChanged: false,
                dateToChanged: false,
                filterChanged: false,
                queryChange: true,
                queryChangeDelay: 100,
                queryChangeInstantRegex: /\S/,
                queryChangeMinLength: 2,
                searchTypeChanged: false,
            },
            url: "/test/",
        } as CategorizeSettings;

        settings = new CategorizeSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof CategorizeSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbBusy).toBeDefined();
        expect (settings.cbError).toBeDefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.trigger.clientIdChanged).toEqual(false);
        expect (settings.trigger.dateFromChanged).toEqual(false);
        expect (settings.trigger.dateToChanged).toEqual(false);
        expect (settings.trigger.filterChanged).toEqual(false);
        expect (settings.trigger.queryChangeDelay).toEqual(100);
        expect (settings.trigger.queryChangeInstantRegex).toEqual(/\S/);
        expect (settings.trigger.queryChange).toEqual(true);
        expect (settings.trigger.queryChangeMinLength).toEqual(2);
        expect (settings.trigger.searchTypeChanged).toEqual(false);
        expect (settings.url).toEqual("/test/");
    });

    it("Should be poassible to pass a partial CategorizeSettings object to use for values.", () => {
        let fnSuccess = (categories: Categories) => { /* dummy */};

        let settings = {
            cbSuccess: fnSuccess,
            enabled: false,
            trigger: {
                clientIdChanged: false,
            },
        } as CategorizeSettings;

        settings = new CategorizeSettings(settings);

        expect(settings).toBeDefined();
        expect(settings instanceof CategorizeSettings).toBeTruthy();
        expect (settings.enabled).toBeFalsy();
        expect (settings.cbBusy).toBeUndefined();
        expect (settings.cbError).toBeUndefined();
        expect (settings.cbSuccess).toBeDefined();
        expect (settings.trigger.clientIdChanged).toEqual(false);
        expect (settings.trigger.dateFromChanged).toEqual(true);
        expect (settings.trigger.dateToChanged).toEqual(true);
        expect (settings.trigger.filterChanged).toEqual(true);
        expect (settings.trigger.queryChangeDelay).toEqual(-1);
        expect (settings.trigger.queryChangeInstantRegex).toEqual(/\S\n$/);
        expect (settings.trigger.queryChange).toEqual(true);
        expect (settings.trigger.queryChangeMinLength).toEqual(2);
        expect (settings.trigger.searchTypeChanged).toEqual(true);
        expect (settings.url).toEqual("/search/categorize");
    });

});
