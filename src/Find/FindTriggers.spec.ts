import { FindTriggers } from '.';

describe('FindTriggers', () => {

    it('Should be able to create default FindTrigger', () => {
        let ft = new FindTriggers();
        expect(typeof ft).toBe('object');
    });

    it('Should be able to create default FindTrigger', () => {
        let settings = {
            clientCategoryFilterChanged: false,
            clientIdChanged: false,
            dateFromChanged: false,
            dateToChanged: false,
            filterChanged: false,
            matchGenerateContentChanged: false,
            matchGenerateContentHighlightsChanged: false,
            matchGroupingChanged: false,
            matchOrderByChanged: false,
            matchPageChanged: false,
            matchPageSizeChanged: false,
            queryChange: false,
            queryChangeDelay: 100,
            queryChangeInstantRegex: /.+/,
            queryChangeMinLength: 1,
            searchTypeChanged: false,
            uiLanguageCodeChanged: true,
        } as FindTriggers;

        let ft = new FindTriggers(settings);
        expect(typeof ft).toBe('object');
        for (const key in ft) {
            if (ft.hasOwnProperty(key)) {
                expect(ft[key]).toBe(settings[key]);
            }
        }
    });
});
