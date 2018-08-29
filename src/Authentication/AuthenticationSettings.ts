import { BaseSettings } from '../Common/BaseSettings';

import { AuthenticationTriggers } from './AuthenticationTriggers';

/**
 * These are all the settings that can affect the use of jwt authentication in the search-client.
 */
export class AuthenticationSettings extends BaseSettings<any> {

    /**
     * Whether or not this setting-feature is enabled or not.
     *
     * @override Overrides base-settings and sets the automatic authentication off by default.
     */
    public enabled?: boolean = false;

    /**
     * This is the token, if you need to set an initial value (i.e. if you already have the token)
     */
    public token?: string = undefined;

    /**
     * This is the path to the value returned by the authentication-call.
     * Should be a name-based lookup array, pointing to where the resulting auth-token is to be found.
     */
    public tokenPath?: string[] = ['jwtToken'];

    /**
     * The trigger-settings for when a new auth-token is to be requested.
     */
    public triggers?: AuthenticationTriggers = new AuthenticationTriggers();

    /**
     * The endpoint to do authentication lookups on.
     */
    public url?: string = 'auth/token';

    /**
     * Creates an AuthenticationSettings object for you, based on AuthenticationSettings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default AuthenticationSettings.
     */
    constructor(settings?: AuthenticationSettings) {
        super(settings);

        if (settings) {
            this.enabled = typeof settings.enabled !== 'undefined' ? settings.enabled : this.enabled;
            this.token = typeof settings.token !== 'undefined' ? settings.token : this.token;
            this.tokenPath = typeof settings.tokenPath !== 'undefined' ? settings.tokenPath : this.tokenPath;
            this.triggers = typeof settings.triggers !== 'undefined' ? new AuthenticationTriggers(settings.triggers.expiryOverlap) : this.triggers;
            this.url = typeof settings.url !== 'undefined' ? settings.url.replace(/(^\/+)|(\/+$)/g, '') : this.url;
        }
    }

}
