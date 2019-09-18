import { BaseSettings, IBaseSettings } from "../Common/BaseSettings";

import { AuthenticationTriggers } from "./AuthenticationTriggers";
import { QueryChangeSpecifications } from "../Common/QueryChangeSpecifications";

export interface IAuthenticationSettings extends IBaseSettings<any> {
    /**
     * Sets authentication type - jwt or oidc.
     */
    type: string;
       
    /**
     * This is the token, if you need to set an initial value (i.e. if you already have the token)
     */
    token?: string;
    
    /**
     * The trigger-settings for when a new auth-token is to be requested.
     */
    triggers?: AuthenticationTriggers;

    /**
     * This is the path to the value returned by the authentication-call.
     * Should be a name-based lookup array, pointing to where the resulting auth-token is to be found.
     */
    tokenPath?: string[];

    /**
     * OpenId Connect specific settings
     */

    /**
     * Sets id of the client registered in identity server
     */
    clientId?: string;

    /**
     * Sets response type which describes response type to be returned by identity server
     */
    responseType?: string;

    /**
     * Sets response mode which describes mode of returning data by identity server
     */
    responseMode?: string;

    /**
     * Sets url for redirect after silent token renew operation
     */
    silentRedirectUri?: string;

    /**
     * Sets url for redirect after login operation
     */
    redirectUri?: string;

    /**
     * Sets url for redirect after logout operation
     */
    postLogoutRedirectUri?: string;

    /**
     * Sets list of scopes requested by client.
     */
    scope?: string;
    
    /**
     * Enables logging of OpenId Connect client.
     */
    enableLogging: boolean;
}

/**
 * These are all the settings that can affect the use of jwt authentication in the search-client.
 */
export class AuthenticationSettings extends BaseSettings<any> {
    /**
     * Sets authentication type - jwt or oidc.
     */
    public type: string;
   
    /**
     * This is the token, if you need to set an initial value (i.e. if you already have the token)
     * Default: Undefined
     */
    public token?: string;

    /**
     * This is the path to the value returned by the authentication-call.
     * Should be a name-based lookup array, pointing to where the resulting auth-token is to be found.
     * Default: ["jwtToken"]
     */
    public tokenPath?: string[];

    /**
     * The trigger-settings for when a new auth-token is to be requested.
     */
    public triggers: AuthenticationTriggers;

    /**
     * OpenId Connect specific settings
     */

    /**
     * Sets id of the client registered in identity server
     */
    public clientId?: string;

    /**
     * Sets response type which describes response type to be returned by identity server
     */
    public responseType?: string;

    /**
     * Sets url for redirect after silent token renew operation
     */
    public silentRedirectUri?: string;

    /**
     * Sets url for redirect after login operation
     */
    public redirectUri?: string;

    /**
     * Sets url for redirect after logout operation
     */
    public postLogoutRedirectUri?: string;

    /**
     * Sets list of scopes requested by client.
     */
    public scope?: string;
    
    /**
     * Enables logging of OpenId Connect client.
     */
    public enableLogging: boolean;

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

        this.type =
            typeof settings.type !== "undefined" ? settings.type : "jwt";

        // Setup our own stuff (props not in the base class).
        this.token =
            typeof settings.token !== "undefined" ? settings.token : undefined;

        this.tokenPath =
            typeof settings.tokenPath !== "undefined"
                ? settings.tokenPath
                : ["jwtToken"];

        this.triggers = new AuthenticationTriggers(settings.triggers);

        // No query changes will trigger outdated warnings
        this.queryChangeSpecs = QueryChangeSpecifications.none;

        this.enableLogging = settings.enableLogging;

        this.clientId = settings.clientId;

        this.responseType = settings.responseType;

        this.scope = settings.scope;

        this.silentRedirectUri = settings.silentRedirectUri;

        this.redirectUri = settings.redirectUri;

        this.postLogoutRedirectUri = settings.postLogoutRedirectUri;
    }
}
