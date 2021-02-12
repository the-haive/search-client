import OIDC, { UserManagerSettings } from 'oidc-client'
import { BaseCall, Fetch, Query } from '../Common'
import { IAuthentication } from './Authentication'
import {
    AuthenticationSettings,
    IAuthenticationSettings,
} from './AuthenticationSettings'
import { AuthToken } from './AuthToken'

/**
 * The OidcAuthentication service is a supporting feature for the other services.
 * Typically used via the [[SearchClient.constructor]] and by providing [[AuthenticationSettings]] settings in
 * the [[Settings.authentication]] property.
 *
 * The authentication system is based on OpenId Connect and needs an end-point to be configured supporting full
 * oidc flows. This service will be monitoring the token-value to see if it is either missing or
 * expired. When that happens a new token will be fetched from the oidc end-point.
 */
export class OidcAuthentication
    extends BaseCall<any>
    implements IAuthentication {
    public static handleSilentSignin(responseMode: string): void {
        const mgr = new OIDC.UserManager({
            loadUserInfo: true,
            filterProtocolClaims: true,
            automaticSilentRenew: true,
            response_mode: responseMode,
            userStore: new OIDC.WebStorageStateStore({
                store: window.sessionStorage,
            }),
        })
        mgr.signinSilentCallback()
        mgr.clearStaleState()
    }

    public static handleSigninRedirect(
        responseMode: string,
        callback: (state: any) => any
    ): void {
        const mgr = new OIDC.UserManager({
            loadUserInfo: true,
            filterProtocolClaims: true,
            response_mode: responseMode,
            automaticSilentRenew: true,
            userStore: new OIDC.WebStorageStateStore({
                store: window.sessionStorage,
            }),
        })

        mgr.signinRedirectCallback().then(user => {
            callback(user.state)
            mgr.clearStaleState()
        })
    }

    public settings: IAuthenticationSettings

    private user: OIDC.UserManager

    private oidcSettings: UserManagerSettings

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
        super() // dummy

        // prepare for super.init
        if (typeof settings === 'string') {
            settings = {
                baseUrl: settings,
                type: 'oidc',
            } as IAuthenticationSettings
        } else {
            settings.type = 'oidc'
        }

        settings = new AuthenticationSettings(settings)
        auth = auth || new AuthToken()
        super.init(settings, auth, fetchMethod)

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
            userStore: new OIDC.WebStorageStateStore({
                store: window.sessionStorage,
            }),
        }

        this.user = new OIDC.UserManager(this.oidcSettings)

        this.user.events.addSilentRenewError(() => {
            this.login(this.user)
        })

        this.user.events.addAccessTokenExpired(() => {
            this.login(this.user)
        })

        this.user.events.addUserSignedOut(() => {
            this.login(this.user)
        })

        if (this.settings.enableLogging) {
            OIDC.Log.logger = console
            OIDC.Log.level = OIDC.Log.INFO
        }

        if (settings.enabled) {
            // We authenticate immediately in order to have the token in place when the first calls come in.
            var oauth = this; 

            // Perform silent signin first, then update token if succesful. If not succesful run full redirect flow.
            this.user.signinSilent()
            .finally (function () {
                oauth.update(null);
            });;            
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
            this.deferredQuery = query
        } else {
            // In case this action is triggered when a delayed execution is already pending, clear that pending timeout.
            clearTimeout(this.delay)

            if (delay > 0) {
                // Set up the delay
                this.delay = setTimeout(() => {
                    const fetchPromise = this.fetch(query)
                    if (fetchPromise) {
                        fetchPromise.catch(error => Promise.resolve(null))
                    }
                }, delay) as any
            } else {
                const fetchPromise = this.fetch(query)
                if (fetchPromise) {
                    fetchPromise.catch(error => Promise.resolve(null))
                }
            }
        }
    }

    /**
     * Fetches the authentication-token from the oidc server.
     * @param query - For the Authentication service this parameter is ignored.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a jwt token.
     */
    protected async fetchInternal(
        query: Query = new Query(),
        suppressCallbacks: boolean = false
    ): Promise<string> {
        const reqInit = this.requestObject(false)

        try {
            if (
                !this.cbRequest(suppressCallbacks, this.settings.url, reqInit)
            ) {
                const err = new Error()
                err.name = 'cbRequestCancelled'
                throw err
            }

            const user = await this.user.getUser()
            if (!user) {
                this.login(this.user)
            } else {
                // Update the token
                this.auth.tokenResolver = () => {
                    const oidcKey = `oidc.user:${this.oidcSettings.authority}:${this.oidcSettings.client_id}`
                    return JSON.parse(window.sessionStorage.getItem(oidcKey))
                        .access_token
                }

                this.cbSuccess(
                    suppressCallbacks,
                    this.auth.authenticationToken,
                    this.settings.url,
                    reqInit
                )

                return user.access_token
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                this.cbError(
                    suppressCallbacks,
                    error,
                    this.settings.url,
                    reqInit
                )
            }
            throw error
        }
    }

    private login(userManager: OIDC.UserManager) {        
        userManager
            .createSigninRequest({ data: { currentUrl: window.location.href } })
            .then(response => {
                window.location.href = response.url
            })
    }
}
