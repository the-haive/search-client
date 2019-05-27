import OIDC, { UserManagerSettings } from "oidc-client";

import { BaseCall, Fetch, Query } from "../Common";
import {
    AuthenticationSettings,
    IAuthenticationSettings
} from "./AuthenticationSettings";
import { Authentication } from "./Authentication";
import { AuthToken } from "./AuthToken";

/**
 * The OidcAuthentication service is a supporting feature for the other services.
 * Typically used via the [[SearchClient.constructor]] and by providing [[AuthenticationSettings]] settings in
 * the [[Settings.authentication]] property.
 *
 * The authentication system is based on OpenId Connect and needs an end-point to be configured supporting full
 * oidc flows. This service will be monitoring the token-value to see if it is either missing or
 * expired. When that happens a new token will be fetched from the oidc end-point.
 */
export class OidcAuthentication extends BaseCall<any> implements Authentication {

    static handleSilentSignin(): void {              
        let mgr = new OIDC.UserManager({ loadUserInfo: true, filterProtocolClaims: true, userStore: new OIDC.WebStorageStateStore({ store: window.sessionStorage }) });
        mgr.signinSilentCallback();
    }

    static handleSigninRedirect(): void {            
        let mgr = new OIDC.UserManager({ loadUserInfo: true, filterProtocolClaims: true, userStore: new OIDC.WebStorageStateStore({ store: window.sessionStorage }) });

        mgr.signinRedirectCallback().then(user => {    
            window.history.replaceState({},
            window.document.title,
            window.location.origin + window.location.pathname);
            window.location.href = "index.html";
        });
    }

    public settings: IAuthenticationSettings;   

    private user: OIDC.UserManager;

    private oidcSettings: UserManagerSettings;

    /**
     * Creates an OidcAuthentication object that knows where to get the auth-token and when to refresh it.
     * @param settings - The settings for the authentication object.
     * @param auth - An object that controls the authentication for the lookups.
     */
    constructor(
        settings: IAuthenticationSettings | string,
        auth?: AuthToken,
        fetchMethod?: Fetch
    ) {
        super(); // dummy
       
        // prepare for super.init
        if (typeof settings === "string") {
            settings = { baseUrl: settings, type: "oidc" } as IAuthenticationSettings;
        } else {
            settings.type = "oidc";
        }

        settings = new AuthenticationSettings(settings);
        auth = auth || new AuthToken();
        super.init(settings, auth, fetchMethod);

        this.oidcSettings = {            
            authority: settings.url,
            client_id: settings.clientId,
            response_type: settings.responseType,
            scope: settings.scope,
            silent_redirect_uri: settings.silentRedirectUri,
            redirect_uri: settings.redirectUri,
            post_logout_redirect_uri: settings.postLogoutRedirectUri,
            automaticSilentRenew: true,
            loadUserInfo: true,
            userStore: new OIDC.WebStorageStateStore({ store: window.sessionStorage })
        };
        
        this.user = new OIDC.UserManager(this.oidcSettings);

        let that = this;
        this.user.events.addSilentRenewError(() => {
            that.login(that.user);           
        });

        this.user.events.addAccessTokenExpired(() => {
            that.login(that.user);
        });

        this.user.events.addUserSignedOut(() => {    
            that.login(that.user);
        });
        
        if (this.settings.enableLogging) {
            OIDC.Log.logger = console;
            OIDC.Log.level = OIDC.Log.INFO;
        }

        if (settings.enabled) {
            // We authenticate immediately in order to have the token in place when the first calls come in.
            this.update(null);
        }
    }
        
    /**
     * Fetches the authentication-token from the oidc server.
     * @param query - For the Authentication service this parameter is ignored.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a jwt token.
     */
    public fetch(
        query: Query = new Query(),
        suppressCallbacks: boolean = false
    ): Promise<string> {       
        const reqInit = this.requestObject(false);
        if (this.cbRequest(suppressCallbacks, this.settings.url, reqInit)) {
            let that = this;
            return this.user.getUser().then(user => {                  
                if (!user) {
                    that.login(that.user);
                } else {
                    // Update the token
                    that.auth.tokenResolver = () => {                         
                       let oidcKey = `oidc.user:${that.oidcSettings.authority}:${that.oidcSettings.client_id}`;                       
                       return JSON.parse(window.sessionStorage.getItem(oidcKey)).access_token;                        
                    };
                    
                    that.cbSuccess(
                        suppressCallbacks,
                        that.auth.authenticationToken,
                        that.settings.url,
                        reqInit
                    );
                  
                    return user.access_token;
                }          
            }).catch(error => {
                this.cbError(
                    suppressCallbacks,
                    error,
                    this.settings.url,
                    reqInit
                );
                throw error;
            });
        } else {
            return Promise.resolve(null);    
        }                     
    }

    /**
     * Call the service, but take into account deferredUpdates.
     *
     * @param query The query object to create the fetch for.
     * @param delay A delay for when to execute the update, in milliseconds. Defaults to undefined.
     */
    public update(query: Query, delay?: number): void {
        if (this.deferUpdate) {
            // Save the query, so that when the deferUpdate is again false we can then execute it.
            this.deferredQuery = query;
        } else {
            // In case this action is triggered when a delayed execution is already pending, clear that pending timeout.
            clearTimeout(this.delay);

            if (delay > 0) {
                // Set up the delay
                this.delay = setTimeout(() => {
                    let fetchPromise = this.fetch(query);
                    if (fetchPromise) {
                        fetchPromise.catch(error => Promise.resolve(null));
                    }
                }, delay) as any;
            } else {
                let fetchPromise = this.fetch(query);
                if (fetchPromise) {
                    fetchPromise.catch(error => Promise.resolve(null));
                }
            }
        }
    }
    
    private login(userManager: OIDC.UserManager) {
        userManager.createSigninRequest()
        .then((response) => {
            window.location.href = response.url;
        });     
    }
}
