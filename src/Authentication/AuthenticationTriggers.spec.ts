import { AuthenticationTriggers } from "./AuthenticationTriggers";

describe("AuthenticationTrigger basics", () => {
    it("Should be able to create a default trigger object with expected values", () => {
        let settings = new AuthenticationTriggers();

        expect(settings).toBeDefined();
        expect(settings instanceof AuthenticationTriggers).toBeTruthy();
        expect(settings.expiryOverlap).toBe(60);
    });

    it("Should be able to create a trigger object with override value", () => {
        let settings = new AuthenticationTriggers(10);

        expect(settings).toBeDefined();
        expect(settings instanceof AuthenticationTriggers).toBeTruthy();
        expect(settings.expiryOverlap).toBe(10);
    });
});
