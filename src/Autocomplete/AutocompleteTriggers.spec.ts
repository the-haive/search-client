import { AutocompleteTriggers } from ".";

describe("AutocompleteTriggers", () => {
    it("Should be able to create default AutocompleteTrigger", () => {
        let at = new AutocompleteTriggers();
        expect(typeof at).toBe("object");
    });

    it("Should be able to create default AutocompleteTrigger", () => {
        let settings = {
            queryChange: false,
            queryChangeDelay: 100,
            queryChangeInstantRegex: /.+/,
            queryChangeMinLength: 1,
            searchTypeChanged: false,
            uiLanguageCodeChanged: true,
            maxSuggestionsChanged: true
        } as AutocompleteTriggers;

        let at = new AutocompleteTriggers(settings);
        expect(typeof at).toBe("object");
        for (const key in at) {
            if (at.hasOwnProperty(key)) {
                expect(at[key]).toBe(settings[key]);
            }
        }
    });
});
