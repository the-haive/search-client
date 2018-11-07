/**
 * These are the triggers that define when and when not to trigger an authentication lookup.
 */
export class AuthenticationTriggers {
    /**
     * Defines how long in seconds before expiry we should request a new auth token.
     * Default: 60 - Refresh the token after 1 minute.
     */
    public expiryOverlap?: number;

    /**
     * Creates an AuthenticationTrigger object for you.
     * @param triggers - The trigger defined here will override the default AuthenticationTrigger.
     */
    constructor(triggers: AuthenticationTriggers = {}) {
        this.expiryOverlap =
            typeof triggers.expiryOverlap !== "undefined"
                ? triggers.expiryOverlap
                : 60;
    }
}
