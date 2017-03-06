export class AuthenticationTrigger {

    /**
     * Defines how long in seconds before expiry we should request a new auth token.
     */
    public expiryOverlap: number = 60;

    /**
     * Creates an AuthenticationTrigger object for you, based on AuthenticationTrigger defaults and the overrides provided as a param.
     * @param authenticationTrigger - The trigger defined here will override the default AuthenticationTrigger.
     */
    constructor(authenticationTrigger?: AuthenticationTrigger) {
        Object.assign(this, authenticationTrigger);
    }
}
