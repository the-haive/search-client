import { BaseSettings, IBaseSettings } from "../Common/BaseSettings";

import { AuthenticationTriggers } from "./AuthenticationTriggers";

export interface IAuthenticationSettings extends IBaseSettings<any> {
    /**
     * This is the token, if you need to set an initial value (i.e. if you already have the token)
     */
    token?: string;

    /**
     * This is the path to the value returned by the authentication-call.
     * Should be a name-based lookup array, pointing to where the resulting auth-token is to be found.
     */
    tokenPath?: string[];

    /**
     * The trigger-settings for when a new auth-token is to be requested.
     */
    triggers?: AuthenticationTriggers;
}

/**
 * These are all the settings that can affect the use of jwt authentication in the search-client.
 */
export class AuthenticationSettings extends BaseSettings<any> {
    /**
     * This is the token, if you need to set an initial value (i.e. if you already have the token)
     */
    public token?: string;

    /**
     * This is the path to the value returned by the authentication-call.
     * Should be a name-based lookup array, pointing to where the resulting auth-token is to be found.
     */
    public tokenPath?: string[];

    /**
     * The trigger-settings for when a new auth-token is to be requested.
     */
    public triggers: AuthenticationTriggers;

    /**
     * Creates an AuthenticationSettings object for you, based on AuthenticationSettings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default AuthenticationSettings.
     */
    constructor(settings: IAuthenticationSettings | string) {
        super(); // dummy (using init instead)

        // Setup settings object before calling super.init with it.
        if (typeof settings === "string") {
            settings = { baseUrl: settings } as IAuthenticationSettings;
        }

        settings.enabled =
            typeof settings.enabled !== "undefined" ? settings.enabled : false;

        settings.basePath =
            typeof settings.basePath !== "undefined" ? settings.basePath : "";

        settings.servicePath =
            typeof settings.servicePath !== "undefined"
                ? settings.servicePath
                : "auth/login";

        super.init(settings);

        // Setup our own stuff (props not in the base class).
        this.token =
            typeof settings.token !== "undefined" ? settings.token : undefined;

        this.tokenPath =
            typeof settings.tokenPath !== "undefined"
                ? settings.tokenPath
                : ["jwtToken"];

        this.triggers = new AuthenticationTriggers(settings.triggers);
    }
}
