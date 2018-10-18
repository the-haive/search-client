import { CategorizeTriggers } from ".";

describe("CategorizeTriggers", () => {
    it("Should be able to create default CategorizeTrigger", () => {
        let ft = new CategorizeTriggers();
        expect(typeof ft).toBe("object");
    });

    it("Should be able to create default CategorizeTrigger", () => {
        let settings = {
            categorizationTypeChanged: false,
            clientIdChanged: false,
            dateFromChanged: false,
            dateToChanged: false,
            filtersChanged: false,
            queryChange: false,
            queryChangeDelay: 100,
            queryChangeInstantRegex: /.+/,
            queryChangeMinLength: 1,
            searchTypeChanged: false,
            uiLanguageCodeChanged: true
        } as CategorizeTriggers;

        let ft = new CategorizeTriggers(settings);
        expect(typeof ft).toBe("object");
        for (const key in ft) {
            if (ft.hasOwnProperty(key)) {
                expect(ft[key]).toBe(settings[key]);
            }
        }
    });
});
