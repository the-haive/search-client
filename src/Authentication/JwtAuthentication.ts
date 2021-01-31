import * as jwt from 'jwt-simple'

import { BaseCall, Fetch, Query } from '../Common'
import { IAuthentication } from './Authentication'
import {
    AuthenticationSettings,
    IAuthenticationSettings,
} from './AuthenticationSettings'
import { AuthToken } from './AuthToken'

/**
 * The JwtAuthentication service is a supporting feature for the other services.
 * Typically used via the [[SearchClient.constructor]] and by providing [[AuthenticationSettings]] settings in
 * the [[Settings.authentication]] property.
 *
 * The authentication system is based on JWT and needs an end-point to be configured from where it will get its
 * authentication-token. This service will be monitoring the token-value to see if it is either missing or
 * expired. When that happens a new token will be fetched from the end-point. The [[AuthenticationSettings.expiryOverlap]]
 * object controls how long before expiration the new token is to be fetched.
 */
export class JwtAuthentication
    extends BaseCall<any>
    implements IAuthentication {
    public settings: IAuthenticationSettings

    /**
     * Creates an JwtAuthentication object that knows where to get the auth-token and when to refresh it.
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
                type: 'jwt',
            } as IAuthenticationSettings
        } else {
            settings.type = 'jwt'
        }

        settings = new AuthenticationSettings(settings)
        auth = auth || new AuthToken()
        super.init(settings, auth, fetchMethod)

        // Set own this props
        if (settings.token) {
            // this.auth.authenticationToken = settings.token;
            const token = settings.token
            this.auth.tokenResolver = () => token
            settings.token = undefined
            this.setupRefresh()
        } else if (settings.enabled) {
            // We authenticate immediately in order to have the token in place when the first calls come in.
            this.update(null)
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
     * Fetches the authentication-token from the server.
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

            const response: Response = await this.fetchMethod(
                this.settings.url,
                reqInit
            )
            if (!response.ok) {
                throw Error(
                    `${response.status} ${response.statusText} for request url '${this.settings.url}'`
                )
            }

            let data: any = await response.json()

            // Find the auth token by using the settings for where it is in the structure.
            for (const i of this.settings.tokenPath) {
                data = data[i]
            }

            // Update the token
            this.auth.tokenResolver = () => data

            // Set up a timer for refreshing the token before/if it expires.
            this.setupRefresh()

            this.cbSuccess(
                suppressCallbacks,
                this.auth.authenticationToken,
                this.settings.url,
                reqInit
            )

            return this.auth.authenticationToken
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

    private setupRefresh() {
        try {
            if (this.auth && this.auth.authenticationToken) {
                const token = jwt.decode(
                    this.auth.authenticationToken,
                    null,
                    true
                )
                const expiration = token.exp
                    ? new Date(token.exp * 1000)
                    : undefined
                if (expiration) {
                    let remainingSeconds =
                        (expiration.valueOf() - new Date().valueOf()) / 1000
                    remainingSeconds = Math.max(
                        remainingSeconds - this.settings.triggers.expiryOverlap,
                        0
                    )

                    // console.log(
                    //     `Setting up JWT-token to refresh in ${remainingSeconds} seconds, at ${expiration}.`,
                    //     "Token:",
                    //     token
                    // );
                    setTimeout(() => {
                        this.update(null)
                    }, remainingSeconds * 1000)
                } else {
                    // console.log(
                    //     "The received JWT token does not expire.",
                    //     "Token:",
                    //     token
                    // );
                }
            }
        } catch (e) {
            console.error(
                `Unable to parse the provided token '${this.auth.authenticationToken}': ${e}`
            )
        }
    }
}
