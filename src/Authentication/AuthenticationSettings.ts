import { SearchSettings } from '../Common/SearchSettings';

import { AuthenticationTrigger } from './AuthenticationTrigger';

/**
 * These are all the settings that can affect the use of jwt authentication in the search-client.
 */
export class AuthenticationSettings extends SearchSettings<any> {

    /**
     * This is the token, if you need to set an initial value (i.e. if you already have the token)
     */
    public token: string = undefined;

    /**
     * This is the path to the value returned by the authentication-call.
     * Should be a name-based lookup array, pointing to where the resulting auth-token is to be found.
     */
    public tokenPath: string[] = ["jwtToken"];

    /**
     * The trigger-settings for when a new auth-token is to be reqeusted.
     */
    public trigger: AuthenticationTrigger = new AuthenticationTrigger();

    /**
     * The endpoint to do authentication lookups on.
     */
    public url: string = '/auth/token';

    /**
     * Creates an AuthenticationSettings object for you, based on AuthenticationSettings defaults and the overrides provided as a param.
     * @param authenticationSettings - The settings defined here will override the default AuthenticationSettings.
     */
    constructor(authenticationSettings?: AuthenticationSettings) {
        super(authenticationSettings);
        if (authenticationSettings) {
            authenticationSettings.trigger = new AuthenticationTrigger(authenticationSettings.trigger);
        }
        Object.assign(this, authenticationSettings);
    }

}
