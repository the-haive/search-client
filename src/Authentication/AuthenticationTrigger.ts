import * as deepmerge from 'deepmerge';

export class AuthenticationTrigger {

    /**
     * Creates an AuthenticationTrigger object for you, based on AuthenticationTrigger defaults and the overrides provided as a param.
     * @param authenticationTrigger - The trigger defined here will override the default AuthenticationTrigger.
     */
    public static new(authenticationTrigger?: AuthenticationTrigger) {
        return deepmerge(new AuthenticationTrigger(), authenticationTrigger || {}, {clone: true}) as AuthenticationTrigger;
    }

    /**
     * Defines how long in seconds before expiry we should request a new auth token.
     */
    public expiryOverlap: number = 60;
}
