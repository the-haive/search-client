import { Setting } from '../Common';

import { AuthenticationTrigger } from './AuthenticationTrigger';

/**
 * These are all the settings that can affect the use of jwt authentication in the search-client.
 */
export class AuthenticationSettings extends Setting {

    /**
     * Called twice for each request: 
     * 1. First when starting to fetch the authentication-token. 
     * 2. Then when done with fetching the token (both for success and failure).
     */
    public cbBusy: (isBusy: boolean, url: string, reqInit: RequestInit) => void = undefined;

    /**
     * A notifier method to call whenever the lookup fails.
     * @param error - An error object as given by the fetch operation.
     */
    public cbError: (error: any) => void = undefined;

    /**
     * A notifier method to call whenever the lookup results have been received.
     * @param authToken - The lookup results.
     */
    public cbSuccess: (authToken: string) => void = undefined;

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
        super();
        if (authenticationSettings) {
            authenticationSettings.trigger = new AuthenticationTrigger(authenticationSettings.trigger);
        }
        Object.assign(this, authenticationSettings);
    }

}
