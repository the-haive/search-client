/**
 * These are the triggers that define when and when not to trigger an authentication lookup.
 */
export class AuthenticationTriggers {
    /**
     * Creates an AuthenticationTrigger object for you.
     * @param expiryOverlap - Defines how long in seconds before expiry we should request a new auth token.
     */
    constructor(public expiryOverlap: number = 60) {}
}
