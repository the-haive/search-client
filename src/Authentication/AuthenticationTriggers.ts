/**
 * These are the triggers that define when and when not to trigger an authentication lookup.
 */
export class AuthenticationTriggers {

    /**
     * Defines how long in seconds before expiry we should request a new auth token.
     */
    public expiryOverlap?: number = 60;

    /**
     * Creates an AuthenticationTrigger object for you, based on AuthenticationTrigger defaults and the overrides provided as a param.
     * @param triggers - The triggers defined here will override the default AuthenticationTriggers.
     */
    constructor(triggers?: AuthenticationTriggers) {
        if (triggers) {
            this.expiryOverlap = typeof triggers.expiryOverlap !== "undefined" ? triggers.expiryOverlap : this.expiryOverlap;
        }
    }
}
